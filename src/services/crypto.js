import router from '@/router';
import { useMainStore } from '@/store';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import cryptoJs from 'crypto-js';
import { add, format } from 'mathjs';
import db from '../db';

let networkConfig = {
  messagePrefix: 'unused',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

if (process.env.VUE_APP_NETWORK === 'mainnet') {
  networkConfig = {
    messagePrefix: 'unused',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x3e,
    scriptHash: 0x85,
    wif: 0xbe,
  };
}
// libs.bitcoin.networks.stealthtestnet = {
//   messagePrefix: 'unused',
//   bip32: {
// public: 0x043587cf,
// private: 0x04358394,
//   },
//   pubKeyHash: 0x6f,
//   scriptHash: 0xc4,
//   wif: 0xef
// };

// libs.bitcoin.networks.stealth = {
//   messagePrefix: 'unused',
//   bip32: {
// public: 0x0488b21e,
// private: 0x0488ade4
//   },
//   pubKeyHash: 0x3e,
//   scriptHash: 0x85,
//   wif: 0xbe
// };

const CryptoService = {
  constraints: {
    XST_USD: 0.199,
    XST_BTC: 0.00000364,
    changePercent24Hr: 0,
    MINIMAL_CHANGE: 0,
  },
  isFirstArrival: true,
  network: networkConfig,
  master: null,
  seed: null,
  txWithLabels: {},
  // password: '',

  async init() {
    // check if there's already a wallet stored in the db
    // if so, ask for password via lock screen and
    // retrieve the stored wallet and generate the master from the stored seed
    let wallet = await this.getWalletFromDb();
    this.getTxWithLabels();
    await this.getAccounts();
    if (!wallet || wallet.length <= 0) {
      router.push('/welcome');
    } else if (this.isFirstArrival) {
      router.push('/lock');
      this.isFirstArrival = false;
    }
  },
  async unlock(password) {
    console.log('Unlocking password!', password);
    // no need to validate password because it is validated before calling this method
    // const isPasswordValid = await this.validatePassword(password) // compare user prompted password with stored
    // get password hash so that we can decrypt everything
    let { hash } = await this.hashPassword(password);
    let wallet = await this.getWalletFromDb();
    // seed is stored in a string format because it's the easies to store
    // when retrieving, we need to have the seed in buffer type so we can work with it
    // that's why we are converting the seed from string -> uint8array -> buffer
    // console.log('hash', hash);
    // console.log('wall', this.hexToArray(this.AESDecrypt(wallet[0].seed, hash).toString(cryptoJs.enc.Utf8)));
    // console.log('dec', cryptoJs.AES.decrypt(wallet[0].seed, hash));
    // console.log('deccc', this.AESDecrypt(wallet[0].seed, hash));
    // master key
    this.master = await bip32.fromSeed(
      Buffer.from(
        this.hexToArray(
          this.AESDecrypt(wallet.seed, hash).toString(cryptoJs.enc.Utf8)
        )
      ),
      this.network
    );
    router.push('/dashboard');
    // this.accountDiscovery()
  },
  WIFtoPK(wif) {
    const keyPair = bitcoin.ECPair.fromWIF(wif, this.network);
    // const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: this.network })
    return keyPair;
  },
  hexToArray(hexString) {
    // convert hex string to uint8array
    // helper for seed
    return new Uint8Array(
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
  },
  async generateMnemonicAndSeed() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      // HD wallets are created from a single root seed, which is a 128-, 256-, or 512-bit random number.
      // Everything else in the HD wallet is deterministically derived from this root seed,
      // which makes it possible to re-create the entire HD wallet from that seed in any compatible HD wallet
      const mnemonic = await bip39.generateMnemonic();
      const seed = await bip39.mnemonicToSeedSync(mnemonic); // recovery seed of the master bip32 seed.?
      const master = await bip32.fromSeed(seed, this.network); // aka. root
      this.master = master;
      this.seed = seed;
      // console.log('mnemonic: ', this.mnemonic)
      // console.log('seed: ', this.seed)
      // console.log('master: ', this.master)
      resolve({
        mnemonic,
        // seed,
        master,
      });
    });
  },
  breakAccountPath(path = "0'/0/0") {
    path = path.replace("'", '');
    const account = +path.split('/')[0];
    const change = +path.split('/')[1];
    const address = +path.split('/')[2];
    return {
      account,
      change,
      address,
    };
  },
  getChildFromRoot(account, change, address) {
    // With non-hardened keys, you can prove a child public key is linked to a parent public key
    // using just the public keys.
    // You can also derive public child keys from a public parent key,
    // which enables watch-only wallets.
    // With hardened child keys, you cannot prove that a child public key is linked to a parent public key.
    const keypair = this.master.derivePath(
      `m/44'/${
        process.env.VUE_APP_NETWORK === 'mainnet' ? 125 : 1
      }'/${account}'/${change}/${address}` // TODO CHANGE 1 (TESTNET) TO 125 (XST)
    );
    let acc = this.master.derivePath(
      `m/44'/${
        process.env.VUE_APP_NETWORK === 'mainnet' ? 125 : 1
      }'/${account}'`
    ); // TODO CHANGE 1 (TESTNET) TO 125 (XST)
    // this.WIFtoPK(child.toWIF()) // decrypt
    console.log('1: ', acc.toWIF());
    console.log('2: ', keypair.toWIF());
    return {
      address: bitcoin.payments.p2pkh({
        pubkey: keypair.publicKey,
        network: this.network,
      }).address,
      keyPair: keypair,
      pk: String(acc.neutered().toBase58()),
      wif: keypair.toWIF(),
      // sk: child.privateKey,
      path: `${account}'/${change}/${address}`,
    };
  },
  isMnemonicValid(mnemonic) {
    const isValid = bip39.validateMnemonic(mnemonic);
    return isValid;
  },
  // generateChildAddress(i) {
  //   // https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  //   const path = `m/44'/125'/0'/0/${i}`
  //   const child1 = this.master.derivePath(path)
  //   // private key: child1.privateKey
  //   return bitcoin.payments.p2pkh({
  //     pubkey: child1.publicKey,
  //     network: this.network
  //   }).address
  // },
  async getWalletFromDb() {
    return await db.getItem('wallet');
  },
  async getAccounts() {
    // TODO deprecated. use scanWallet() instead
    let accounts = (await db.getItem('accounts')) || [];
    console.log('Accounts: ', accounts);
    return accounts;
  },
  async storeTxAndLabel(txid, label) {
    let tx = (await db.getItem('transactions')) || {};
    if (tx.length === 0) {
      // first tx in the db
      await db.setItem('transactions', {
        [txid]: label,
      });
    }
    // already have txs, update them with the new tx
    tx = { ...tx, [txid]: label };

    await db.setItem('transactions', tx);

    this.getTxWithLabels();
    return {
      txid,
      label,
    };
  },
  async getTxWithLabels() {
    // transactions with labels are stored in the local db
    // because we dont have any other way to remember labels for particular transactions
    // so we have to fetch them from the db
    const txWithLabels = (await db.getItem('transactions')) || {};
    const mainStore = useMainStore();
    mainStore.SET_TX_WITH_LABELS(txWithLabels);
  },
  async storeAccountInDb(account) {
    let dbAccounts = (await db.getItem('accounts')) || [];
    dbAccounts.push({
      address: account.address,
      label: account.label,
      isArchived: account.isArchived,
      utxo: account.utxo,
      path: account.path,
      pk: account.pk,
      asset: account.asset,
    });

    // this.getAccounts()
    return db.setItem('accounts', dbAccounts);
  },
  async archiveAccount(account) {
    let accounts = await db.getItem('accounts');
    if (accounts.length < 1) {
      console.error('Accounts do not exist');
      return this.getAccounts();
    }

    const wantedIndex = accounts.findIndex(
      (item) => item.address === account.address
    );

    if (accounts[wantedIndex].utxo > 0) {
      console.error('Cannot archive account with balance > 0');
      return this.getAccounts();
    }

    accounts[wantedIndex].isArchived = true;

    await db.setItem('accounts', accounts);

    return this.getAccounts();
  },

  async activateAccount(account) {
    let accounts = await db.getItem('accounts');
    if (accounts.length < 1) {
      return;
    }

    const wantedIndex = accounts.findIndex(
      (item) => item.address === account.address
    );
    accounts[wantedIndex].isArchived = false;

    await db.setItem('accounts', accounts);

    return this.getAccounts();
  },

  async changeAccountName(account, accountName) {
    let accounts = await db.getItem('accounts');
    if (accounts.length < 1) {
      return;
    }

    const wantedIndex = accounts.findIndex(
      (item) => item.address === account.address
    );
    accounts[wantedIndex].label = accountName;

    await db.setItem('accounts', accounts);

    return this.getAccounts();
  },

  async addToAddressBook(addressBookItem) {
    let addressBook = (await db.getItem('addresses')) || [];

    // find largest ID of saved contacts amd add it to saving object
    let largestExistingId = 0;
    if (addressBook.length > 0) {
      largestExistingId = addressBook.reduce((a, b) =>
        a.id > b.id ? a : b
      ).id;
    }
    addressBookItem.id = largestExistingId + 1;

    addressBook.push(JSON.parse(JSON.stringify(addressBookItem)));
    await db.setItem('addresses', addressBook);

    return addressBook;
  },

  async deleteFromAddressBook(addressBookItem) {
    let addressBook = (await db.getItem('addresses')) || [];

    const wantedIndex = addressBook.findIndex(
      (item) => item.id === addressBookItem.id
    );

    addressBook.splice(wantedIndex, 1);
    await db.setItem('addresses', JSON.parse(JSON.stringify(addressBook)));

    return addressBook;
  },

  async updateAddressBook(addressBookItem) {
    let addressBook = (await db.getItem('addresses')) || [];
    const wantedIndex = addressBook.findIndex(
      (item) => item.id === addressBookItem.id
    );

    addressBook[wantedIndex] = addressBookItem;
    await db.setItem('addresses', JSON.parse(JSON.stringify(addressBook)));

    return addressBook;
  },

  async getAddressBook() {
    return (await db.getItem('addresses')) || [];
  },

  async validatePassword(password) {
    // receive password as plain text, hash it, compare it with existing hash in db
    let wallet = await this.getWalletFromDb();
    let { hash } = await this.hashPassword(password);
    return hash === wallet.password;
  },
  async hashPassword(password) {
    let wallet = await this.getWalletFromDb();
    let salt = null;
    if (wallet && wallet.salt) {
      // console.log('ima vec salt ', wallet[0].salt);
      salt = wallet.salt;
    } else {
      salt = cryptoJs.lib.WordArray.random(128 / 8);
    }
    const hash = cryptoJs.PBKDF2(password, salt, {
      keySize: 512 / 32,
      iterations: 1000,
    });
    // console.log('passses', {
    //   storedPassword: wallet[0].password,
    //   hash: hash,
    //   hashHex: hash.toString(cryptoJs.enc.Hex)
    // });
    // this.password = hash.toString(cryptoJs.enc.Hex);
    return {
      salt: salt,
      hash: hash.toString(cryptoJs.enc.Hex),
    };
  },
  async storeWalletInDb(password) {
    console.log('storeWalletInDb - password', password);
    let { hash, salt } = await this.hashPassword(password);

    // user security is ultimately dependent on a password,
    // and because a password usually can't be used directly as a cryptographic key,
    // some processing is required
    // hash the password and store it in the db. PBKDF2 is a one-way hashing algorithm
    // we'll use the hash to encrypt sensitive data like the seed
    // const salt = cryptoJs.lib.WordArray.random(128 / 8)
    // const hash = cryptoJs.PBKDF2(password, salt, {
    //   keySize: 512 / 32,
    //   iterations: 1000
    // })

    // let a = cryptoJs.AES.encrypt('poruka', '123')
    // console.log('---a', a.toString());
    // console.log('---', cryptoJs.AES.decrypt(a, '123').toString(cryptoJs.enc.Utf8));
    // console.log('---', Buffer.from(cryptoJs.AES.decrypt(a, '123').words, 'hex'));

    // encrypt the seed with the hashed password
    // to decrypt the seed, we need to ask the user for his password and then hash it again.
    // if the resulted hash is the same as the hashed password,
    // then the user entered the correct password and the seed can be decrypted
    // console.log('sad cu kriptirati ovaj seed', this.seed.toString('hex'));
    // console.log('s ovim hashom', hash.toString(cryptoJs.enc.Hex));
    // console.log('hash', hash);
    // const encryptedSeed = cryptoJs.AES.encrypt(
    //   this.seed.toString('hex'),
    //   hash
    // )
    const encryptedSeed = this.AESEncrypt(this.seed.toString('hex'), hash);
    // console.log('seed', this.seed);
    // console.log('seed hex', this.seed.toString('hex'));
    // console.log('pokusaj smrti', this.hexToArray(this.seed.toString('hex')));
    // console.log('enc seed encrypted raw', encryptedSeed);
    // console.log('enc seed stored: ', encryptedSeed.ciphertext.toString(cryptoJs.enc.Hex));
    // console.log('decrypted', cryptoJs.AES.decrypt(encryptedSeed, hash.toString(cryptoJs.enc.Hex)).toString(cryptoJs.enc.Utf8));
    // console.log('parsed: ', cryptoJs.enc.Hex.parse(encryptedSeed.ciphertext.toString(cryptoJs.enc.Hex)));
    const wallet = {
      name: 'wallet',
      archived: false,
      seed: encryptedSeed,
      password: hash.toString(cryptoJs.enc.Hex),
      salt: salt,
    };

    await db.setItem('wallet', wallet);

    return wallet;
  },
  async accountDiscovery(n = 0) {
    const mainStore = useMainStore();
    // console.log('start account discovery');
    //  Address gap limit is currently set  to 20. If the software hits 20 unused addresses in a row,
    // it expects there are no used addresses beyond this point and stops searching the address chain.
    // We scan just the external chains, because internal chains receive only coins that come from the associated external chains.
    const GAP_LIMIT = 20;

    let emptyInARow = 0;
    let freeAddresses = [];
    for (let i = 0; i < GAP_LIMIT; i++) {
      // derive the first account's node (index = 0)
      // derive the external chain node of this account
      const acc = this.getChildFromRoot(n, 0, i);
      // console.log('acc.address', acc.address);
      // scan addresses of the external chain; respect the gap limit described below
      // console.log('hdacc', hdAccount);
      const outputs = await mainStore.rpc('getaddressoutputs', [
        acc.address,
        1,
        1,
      ]);
      if (outputs.length > 0) {
        console.log('discovered account: ', acc.path);
        // save account in db?
        // this.storeAccountInDb({
        //   address: acc.address,
        //   path: acc.path,
        //   pk: acc.pk,
        //   name: 'account',
        //   label: 'Account ' + i + 1,
        //   isArchived: false,
        //   utxo: 0,
        //   asset: 'XST'
        // })
        // get account balance
        // if there are some transactions, increase the account index and go to step 1
        // this.accountDiscovery(n+1)
        emptyInARow = 0;
        continue;
      }
      // if there are no transactions, increment counter and go to next address
      emptyInARow += 1;
      freeAddresses.push(acc.path);

      // If the software hits 20 unused addresses in a row, it expects there are no used addresses beyond this point and stops searching the address chain
      if (emptyInARow >= 20) break;
    }
    // Return free account addresses to the calling code
    return {
      freeAddresses,
    };
    // grace concert hunt glide million orange enact habit amazing deal object nurse
  },

  isAddressValid(address) {
    try {
      bitcoin.address.fromBase58Check(address);
      return true;
    } catch (error) {
      return false;
    }
  },

  AESEncrypt(payload, key = '123456789') {
    let encJson = cryptoJs.AES.encrypt(JSON.stringify(payload), key).toString();
    let encData = cryptoJs.enc.Base64.stringify(
      cryptoJs.enc.Utf8.parse(encJson)
    );
    return encData;
  },
  AESDecrypt(payload, key = '123456789') {
    console.log('&&&&payload&&&&', payload);
    let decData = cryptoJs.enc.Base64.parse(payload).toString(
      cryptoJs.enc.Utf8
    );
    let bytes = cryptoJs.AES.decrypt(decData, key).toString(cryptoJs.enc.Utf8);
    return JSON.parse(bytes);
  },
  async scanWallet() {
    const mainStore = useMainStore();
    // initially scan all accounts in the wallet for utxos
    // gethdaccounts retrieves all transactions for a particular account
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const accounts = await this.getAccounts();
      let balance = 0;
      let txs = [];
      let newAccounts = [];
      for (let account of accounts) {
        let accUtxo = 0;
        if (account.pk.length > 0) {
          const hdAccount = await mainStore.rpc('gethdaccount', [account.pk]);
          for (let tx of hdAccount) {
            accUtxo = add(accUtxo, tx.account_balance_change);
            accUtxo = format(accUtxo, { precision: 14 });
            txs.push({
              outputs: tx.outputs,
              amount: tx.account_balance_change,
              txid: tx.txid,
              blocktime: tx.txinfo.blocktime,
              account: account.label,
              pk: account.pk,
            });
          }
          newAccounts.push({
            ...account,
            utxo: Number(accUtxo),
          });
        } else {
          newAccounts.push({
            ...account,
            utxo: Number(account.utxo),
          });
        }
        // When a user looks at their wallet, the software aggregates the sum of value of all their
        // UTXOs and presents it to them as their "balance".
        // Bitcoin doesn’t know balances associated with an account or username as they appear in banking.
        balance = add(balance, accUtxo);
        balance = format(balance, { precision: 14 });
      }
      resolve({
        utxo: balance, // sum of all utxo
        txs: txs, // all transactions,
        accounts: newAccounts,
      });
    });
  },
  nextToUse(freeAddresses) {
    for (let i = 0; i < freeAddresses.length; i++) {
      if (
        parseInt(freeAddresses[i + 1].split('/')[2]) -
          parseInt(freeAddresses[i].split('/')[2]) ===
        1
      ) {
        if (i === 0) {
          return freeAddresses[i];
        } else {
          return freeAddresses[i - 1];
        }
      }
    }
  },
  getHdAccount(accountExtendedPk) {
    const mainStore = useMainStore();
    return mainStore.rpc('gethdaccount', [accountExtendedPk]);
  },

  async getNextAccountPath() {
    let accounts = await this.getAccounts();
    let largest = 0;
    for (let acc of accounts) {
      if (parseInt(acc.path) > largest) {
        largest = parseInt(acc.path);
      }
    }
    return largest + 1;
  },
};

export default CryptoService;
