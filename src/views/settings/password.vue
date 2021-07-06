<template>
  <div class="st-settings-child st-password-container">
    <div class="st-settings-child__overflow">
      <div class="title-bar">
        <div class="left">
          <h2 class="title">Set a new password</h2>
          <p class="subtitle">
            Entering your password will unlock access to your wallet
          </p>
        </div>
        <div class="right">
          <StButton @click="validatePasswords">Save</StButton>
        </div>
      </div>
      <div class="content">
        <p class="notice">
          <span class="bold">Important note:</span> Please be aware that if you
          lose your password, the only access to your account will be through
          the use of Recovery Phrase.
        </p>
        <StFormItem
          label="Current password"
          notice="Please enter a password you are using to access the application"
          :error-message="form.password.$errors"
        >
          <StInput
            type="password"
            placeholder="Please enter current password"
            v-model="password"
          ></StInput>
        </StFormItem>
        <StFormItem
          label="New password"
          notice="Please enter a unique and unused password for accessing the application"
          :error-message="form.newPassword.$errors"
        >
          <StInput
            type="password"
            placeholder="Please enter new password"
            v-model="newPassword"
          ></StInput>
        </StFormItem>
        <StFormItem
          label="Confirm password"
          notice="Newly set password need to match"
          :error-message="form.confirmNewPassword.$errors"
        >
          <StInput
            type="password"
            placeholder="Please confirm new password"
            v-model="confirmNewPassword"
          ></StInput>
        </StFormItem>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import CryptoService from '@/services/crypto';
import cryptoJs from 'crypto-js';
import db from '../../db';
import { useValidation } from 'vue3-form-validation';
import router from '@/router';

export default {
  name: 'StSettingsPassword',
  setup() {
    const password = ref('');
    const newPassword = ref('');
    const confirmNewPassword = ref('');

    const { form, validateFields } = useValidation({
      password: {
        $value: password,
        $rules: [
          async (password) => {
            if (!password) {
              return 'Password is required.';
            }
            let isValid = await CryptoService.validatePassword(password);
            if (!isValid) {
              return 'Incorrect password.';
            }
          },
        ],
      },
      newPassword: {
        $value: newPassword,
        $rules: [
          {
            rule: () => newPassword.value.length || 'New password is required',
          },
          {
            key: 'pw',
            rule: () =>
              newPassword.value === confirmNewPassword.value ||
              'Passwords do not match',
          },
        ],
      },
      confirmNewPassword: {
        $value: confirmNewPassword,
        $rules: [
          {
            rule: () =>
              confirmNewPassword.value.length || 'Confirm password is required',
          },
          {
            key: 'pw',
            rule: () =>
              newPassword.value === confirmNewPassword.value ||
              'Passwords do not match',
          },
        ],
      },
    });

    async function validatePasswords() {
      await validateFields();

      return changePassword();
    }

    async function changePassword() {
      // get old hash
      let { hash } = await CryptoService.hashPassword(password.value);
      // get old wallet data from db
      const wallet = await CryptoService.getWalletFromDb();
      // use old data to decrypt seed
      const decryptedSeed = await CryptoService.AESDecrypt(wallet.seed, hash);
      const decryptedMnemonic = await CryptoService.AESDecrypt(
        wallet.mnemonic,
        hash
      );
      // get hash and salt based on new password
      let { hash: newHash, salt: newSalt } = await CryptoService.hashPassword(
        newPassword.value
      );
      // encrypt seed with new hash
      const encryptedNewSeed = await CryptoService.AESEncrypt(
        decryptedSeed,
        newHash
      );
      // encrypt mnemonic with new hash
      const encryptedNewMnemonic = await CryptoService.AESEncrypt(
        decryptedMnemonic,
        newHash
      );

      // change wallet data with data based on new password
      wallet.seed = encryptedNewSeed;
      wallet.mnemonic = encryptedNewMnemonic;
      wallet.password = newHash.toString(cryptoJs.enc.Hex);
      wallet.salt = newSalt;

      //update wallet with new data
      await db.setItem('wallet', wallet);

      // check for imported accounts to re-encrypt WIF with new password
      // get old account data from db
      const account = await CryptoService.getAccounts();

      account.map(async (item) => {
        if (item.wif) {
          const decryptedWIF = await CryptoService.AESDecrypt(item.wif, hash);
          const encryptedNewWIF = await CryptoService.AESEncrypt(
            decryptedWIF,
            newHash
          );
          item.wif = encryptedNewWIF;
        }
      });

      await db.setItem('accounts', account);

      router.push('/lock');
    }

    return {
      //VARIABLES
      password,
      newPassword,
      confirmNewPassword,
      form,
      //METHODS
      validatePasswords,
      changePassword,
    };
  },
};
</script>

<style scoped>
.notice {
  padding: 24px;
  background-color: var(--background100);
  font-family: var(--secondary-font);
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey900);
  margin: 28px 0;
}

.notice .bold {
  font-weight: bold;
}
.notice p {
  text-align: left;
}
.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.st-form-item {
  margin-bottom: 80px !important;
}
</style>
