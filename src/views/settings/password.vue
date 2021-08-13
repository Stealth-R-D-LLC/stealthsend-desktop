<template>
  <div class="st-settings-child st-password-container">
    <div class="st-settings-child__overflow">
      <div class="title-bar">
        <div class="left">
          <h2 class="title">Set a new password</h2>
          <p class="subtitle">
            Entering your password will unlock your StealthSend application
          </p>
        </div>
        <div class="right">
          <StButton @click="validatePasswords">Save</StButton>
        </div>
      </div>
      <div class="content">
        <p class="notice">
          <span class="bold">Notice:</span> Please be aware that if you lose
          your password, the only access to your account will be through the use
          of your Recovery Phrase.
        </p>
        <div class="set-password-container">
          <StFormItem
            label="Current password"
            :filled="password"
            :error-message="form.password.$errors"
          >
            <template #labelRight>Mandatory</template>
            <StInput
              type="password"
              placeholder="Please enter your current password"
              v-model="password"
            ></StInput>
          </StFormItem>
          <StFormItem
            label="New password"
            :filled="newPassword"
            :error-message="form.newPassword.$errors"
          >
            <template #labelRight>Mandatory</template>
            <StInput
              type="password"
              placeholder="Please enter your new password"
              v-model="newPassword"
            ></StInput>
          </StFormItem>
          <StFormItem
            label="Confirm password"
            :filled="confirmNewPassword"
            :error-message="form.confirmNewPassword.$errors"
          >
            <template #labelRight>Mandatory</template>
            <StInput
              type="password"
              placeholder="Re-enter the new password. Make sure the passwords are identical"
              v-model="confirmNewPassword"
            ></StInput>
          </StFormItem>
        </div>
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
import zxcvbn from 'zxcvbn';

export default {
  name: 'StSettingsPassword',
  setup() {
    const password = ref('');
    const newPassword = ref('');
    const confirmNewPassword = ref('');

    const { form, formFields, validateFields } = useValidation({
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
            rule: () => {
              let details = zxcvbn(newPassword.value);
              if (details.feedback.warning.length) {
                return details.feedback.warning;
              }
              if (details.feedback.suggestions.length) {
                if (
                  'Add another word or two. Uncommon words are better.' ===
                  details.feedback.suggestions[0]
                ) {
                  // replace with
                  return 'Use a longer keyboard pattern with more turns.';
                }
                return details.feedback.suggestions[0];
              } else {
                if (details.score < 3) {
                  return 'Use a longer keyboard pattern with more turns.';
                } else {
                  return true;
                }
              }
            },
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
      try {
        await validateFields();
        changePassword();
      } catch (e) {
        console.log(e);
      } finally {
        for (const formField of formFields.value.values()) {
          if (formField.name === 'password') {
            formField.touched = false;
          }
        }
      }
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
.set-password-container {
  max-width: 424px;
}
.notice {
  padding: 16px 20px;
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
:deep .st-input input {
  padding: 4px 0 2.5px;
}
:deep .st-form-item:last-child {
  margin-bottom: 0;
}
</style>
