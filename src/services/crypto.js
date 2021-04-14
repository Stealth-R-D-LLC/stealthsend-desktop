// @ts-check
import router from '@/router';
import globalState from '@/store/global';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import cryptoJs from 'crypto-js';
import { add, format } from 'mathjs';
import db from '../db';

/**
libs.bitcoin.networks.stealthtestnet = {
  messagePrefix: 'unused',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef
};

libs.bitcoin.networks.stealth = {
  messagePrefix: 'unused',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4
  },
  pubKeyHash: 0x3e,
  scriptHash: 0x85,
  wif: 0xbe
};
*/

const CryptoService = {
  constraints: {
    XST_USD: 0.17401,
    FEE: 0.01,
    MINIMAL_CHANGE: 0.01
  },
  isFirstArrival: true,
  network: {
    messagePrefix: 'unused',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  },
  master: null,
  seed: null,

  /**
   * @description Check if there's already a wallet stored in the db.
   * If so, ask for password via lock screen and retrieve the stored
   * wallet and generate the master from the stored seed.
   */
  async init() {
    let wallet = await this.getWalletFromDb();
    await this.getAccounts(); // TODO: What to do with this call here?
    if (wallet.length <= 0) {
      router.push('/welcome');
    } else if (this.isFirstArrival) {
      router.push('/lock');
      this.isFirstArrival = false;
    }
  },
  /**
   * @description Unlock wallet with password.
   * No need to validate password because it is validated before calling this method.
   * The seed is stored in a string format because it's the easies to store.
   * When retrieving, we need to have the seed in buffer type so we can work with it -
   * that's why we are converting the seed from string -> uint8array -> buffer
   *
   * @param {string} password
   */
  async unlock(password) {
    // Get the password hash so that we can decrypt everything
    let { hash } = await this.hashPassword(password);
    let wallet = await this.getWalletFromDb();
    this.master = bip32.fromSeed(Buffer.from(this.hexToArray(this.AESDecrypt(wallet[0].seed, hash.toString(cryptoJs.enc.Hex)).toString(cryptoJs.enc.Utf8))), this.network);
    router.push('/dashboard')
    // this.accountDiscovery()
  },
  /**
   * @description Wallet Import Format (WIF) - encode a private ECDSA (Eliptic Curve Digital Signature Algorithm) key
   * so as make it easier to copy. https://en.bitcoin.it/wiki/Wallet_import_format
   *
   * @param {string} wif
   * @return {bitcoin.ECPair.ECPairInterface}
   */
  WIFtoPK(wif) {
    const keyPair = bitcoin.ECPair.fromWIF(wif, this.network);
    // const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: this.network })
    return keyPair;
  },
  /**
   *
   * @param {string} hexString
   * @return {Uint8Array}
   */
  hexToArray(hexString) {
    // convert hex string to uint8array
    // helper for seed
    return new Uint8Array(
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
  },
  /**
   * @description HD wallets are created from a single root seed, which is a 128-, 256-, or 512-bit random number.
   * Everything else in the HD wallet is deterministically derived from this root seed,
   * which makes it possible to re-create the entire HD wallet from that seed in any compatible HD wallet
   * @return {{mnemonic: string, master: bip32.BIP32Interface}}
   */
  generateMnemonicAndSeed() {
    console.log('generateMnemonicAndSeed');
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic); // recovery seed of the master bip32 seed.? - seed buffer
    const master = bip32.fromSeed(seed, this.network); // aka. root
    this.master = master;
    this.seed = seed;
    return {
      mnemonic,
      master
    }
  },
  /**
   *
   * @param {string} path
   * @return {{account: number, change: number, address: number}}
   */
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
  /**
   *
   * @param {string} account
   * @param {string} change
   * @param {string} address
   * @return {{address: string, keyPair: string, pk: string, wif: string, path: string}}
   */
  getChildFromRoot(account, change, address) {
    // child === keypair
    console.log('start!!!!getChildFromRoot', account, change, address); // 5 0 19
    console.log('IMA LI MASTERA????? this.master', this.master);

    // m/ purpose ' / coin_type' / account' / change / address_index
    // coin_type' === in our case is 1' (Testnet - all coins)
    const child = this.master.derivePath(
      `m/44'/1'/${account}'/${change}/${address}`
    );
    let acc = this.master.derivePath(
      `m/44'/1'/${account}'`
    );
    console.log('getChildFromRoot - ACCOUNT address', bitcoin.payments.p2pkh({ pubkey: acc.publicKey }).address);
    console.log('getChildFromRoot - CHILD address', bitcoin.payments.p2pkh({ pubkey: child.publicKey }).address);
    // this.WIFtoPK(child.toWIF()) // decrypt
    return {
      address: bitcoin.payments.p2pkh({ pubkey: child.publicKey }).address,
      keyPair: child, // TODO: keyPair !== child
      pk: String(acc.neutered().toBase58()),
      wif: child.toWIF(),
      // sk: child.privateKey, // TODO: Test only, else no-no
      path: `${account}'/${change}/${address}`,
    }
  },
  /**
   *
   * @param {string} mnemonic
   * @return {Boolean}
   */
  isMnemonicValid(mnemonic) {
    const isValid = bip39.validateMnemonic(mnemonic);
    return isValid;
  },
  /**
  generateChildAddress(i) {
    // https://github.com/satoshilabs/slips/blob/master/slip-0044.md
    const path = `m/44'/125'/0'/0/${i}`
    const child1 = this.master.derivePath(path)
    // private key: child1.privateKey
    return bitcoin.payments.p2pkh({
      pubkey: child1.publicKey,
      network: this.network
    }).address
  },
  */
  /**
   * @return {Promise<*>}
   */
  async getWalletFromDb() {
    /**
     * TODO: remove later (example entries in the DB)
     *  0: {name: "wallet", archived: false, seed: "VTJGc2RHVmtYMTltKzNDWGN3cThaQTBLM2pzWE5NUS9NNnUvNn…ZWFB4b1BFbk5zSFQwYzVmV21sdFVsaE5aYXFwTWw5QzNFZz09", password:     "7ee408c39256069678029c0740e6931e83f101f415ed29d9db…106c18b19f1b78e984c443903d4e74d0f28f9440733392de1", balance: 0, …}
        1: {name: "account", address: "mnLNmZCz2Lb1MSVNYHDujE3jKu8soxMZda", label: "brljavko", isArchived: false, balance: 0, …}
     */
    // await db.remove({ label: 'testko' }); // TODO: If we want to remove the specific wallet by 'label' field
    let wallet = await db.find({ name: 'wallet' });
    globalState.setWallet(wallet[0]);
    return wallet;
  },
  /**
   *
   * @return {Promise<Array<*>>} accounts
   */
  async getAccounts() {
    let accounts = await db.find({ name: 'account' });
    // globalState.setAccounts(accounts)
    console.log('Accounts: ', accounts);
    return accounts;
  },
  /**
   *
   * @param {object} account
   * @returns
   */
  async storeAccountInDb(account) {
    console.log('storam', account);
    let acc = await db.insert({
      name: 'account',
      address: account.address,
      label: account.label,
      isArchived: account.isArchived,
      utxo: account.utxo,
      path: account.path,
      pk: account.pk,
      asset: account.asset
    });
    // this.getAccounts()
    return acc
  },
  /**
   *
   * @param {object} account
   * @return {Promise<*>}
   */
  async archiveAccount(account) {
    await db.update(
      { name: 'account', address: account.address },
      {
        name: 'account',
        address: account.address,
        label: account.label,
        isArchived: true,
        utxo: account.utxo,
        path: account.path,
      }
    );
    await this.getAccounts();
  },
  /**
   *
   * @param {object} account
   * @return {Promise<*>}
   */
  async unarchiveAccount(account) {
    await db.update(
      { name: 'account', address: account.address },
      {
        name: 'account',
        address: account.address,
        label: account.label,
        isArchived: false,
        utxo: account.utxo,
        path: account.path,
      }
    );
    await this.getAccounts();
  },
  /**
   *
   * @param {string} password
   * @return {Promise<boolean>}
   */
  async validatePassword(password) {
    // receive password as plain text, hash it, compare it with existing hash in db
    let wallet = await this.getWalletFromDb();
    let { hash } = await this.hashPassword(password);
    // console.log('newly hashed: ', hash);
    // console.log('stored pass hash: ', wallet[0].password);
    return hash === wallet[0].password;
  },
  /**
   *
   * @param {string | cryptoJs.lib.WordArray} password
   * @param {string | cryptoJs.lib.WordArray} salt
   * @return cryptoJs.lib.WordArray
   */
  generateKeyHash(password, salt) {
    const options = {
      keySize: 512 / 32, // dklen - desired lenght of the produced output (or hash),
      iterations: 1000, // recommended > 1000
    };
    // PBKDF2 - fairly slow and more resilient to brute force
    return cryptoJs.PBKDF2(password, salt, options);
  },
  /**
   *
   * @param {string | cryptoJs.lib.WordArray} password
   * @return {Promise<{ salt: string | cryptoJs.lib.WordArray, hash: string | cryptoJs.lib.WordArray }>} hashed password string
   */
  async hashPassword(password) {
    let wallet = await this.getWalletFromDb();
    let salt = null;
    if (wallet.length > 0) {
      // console.log('ima vec salt ', wallet[0].salt);
      salt = wallet[0].salt
    } else {
      console.log('novi salt');
      salt = cryptoJs.lib.WordArray.random(128 / 8); // also known as ssid (hex or ASCII)
    }
    const hash = this.generateKeyHash(password, salt);

    return {
      salt,
      hash: hash.toString(cryptoJs.enc.Hex),
    }
  },
  /**
   *
   * @param {string} password
   * @return {Promise<*>}
   */
  async storeWalletInDb(password) {
    // console.log('store wallet in db', password);
    let { hash, salt } = await this.hashPassword(password);
    return new Promise((resolve) => {
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
      // console.log('just encrypted: ', encryptedSeed.toString());
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
        salt: salt
      };

      db.insert(wallet, () => {
        console.log('wallet stored in db: ', wallet)
      });

      resolve(wallet)
    })
  },
  async accountDiscovery(n = 0) {
    // console.log('start account discovery');
    //  Address gap limit is currently set to 20. If the software hits 20 unused addresses in a row,
    // it expects there are no used addresses beyond this point and stops searching the address chain.
    // We scan just the external chains, because internal chains receive only coins that come from the associated external chains.
    const GAP_LIMIT = 20;

    let emptyInARow = 0;
    for (let i = 0; i < GAP_LIMIT; i++) {
      // derive the first account's node (index = 0)
      // derive the external chain node of this account
      const acc = this.getChildFromRoot(`${n}`, '0', `${i}`); // TODO: check `n` argument, should be 'string'
      console.log('accountDiscovery - acc', acc.address);
      // scan addresses of the external chain; respect the gap limit described below
      // const hdAccount = await globalState.rpc('gethdaccount', [acc.pk])
      // console.log('hdacc', hdAccount);
      const inputs = await globalState.rpc('getaddressoutputs', [acc.address, 1, 10]);
      if (inputs.length > 0) {
        console.log('discovered account: ', acc.path);
        // save account in db?
        await this.storeAccountInDb({
          address: acc.address,
          path: acc.path,
          pk: acc.pk,
          name: 'account',
          label: 'Account ' + i + 1,
          isArchived: false,
          utxo: 0,
          asset: 'XST',
        });
        // get account balance
        // if there are some transactions, increase the account index and go to step 1
        // this.accountDiscovery(n+1)
        emptyInARow = 0;
        continue;
      }
      // if there are no transactions, increment counter and go to next address
      emptyInARow += 1;

      // If the software hits 20 unused addresses in a row, it expects there are no used addresses beyond this point and stops searching the address chain
      if (emptyInARow >= 20) break;
    }
    // grace concert hunt glide million orange enact habit amazing deal object nurse

  },
  /**
   * @param {Object} payload
   * @param {string} key
   * @return {string}
   */
  AESEncrypt(payload, key = '123456789') {
    let encJson = cryptoJs.AES.encrypt(JSON.stringify(payload), key).toString()
    let encData = cryptoJs.enc.Base64.stringify(cryptoJs.enc.Utf8.parse(encJson))
    return encData
  },

  /**
   * @description CryptoJS with custom key `key` encode payload `payload`
   * Feed the CryptoJS's toString overload the appropriate encoder (cryptoJs.enc.Utf8), else
   * it defaults to hex.
   *
   * @param {string} payload
   * @param {string} key
   * @return {Object}
   */
  AESDecrypt(payload, key = '123456789') {
    let decData = cryptoJs.enc.Base64.parse(payload).toString(cryptoJs.enc.Utf8); // encrypted utf8 data
    let bytes = cryptoJs.AES.decrypt(decData, key).toString(cryptoJs.enc.Utf8); // that goes here with the key/passphrase
    return JSON.parse(bytes);
  },

  /**
   * @description Scan the wallet. Initially, scan all accounts in the wallet for UTXOs.
   * gethdaccounts RPC method retrieves all transactions for a particular account.
   * @return {Promise<*>}
   */
  async scanWallet() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const accounts = await this.getAccounts();
      let utxo = 0;
      let txs = [];
      for (let account of accounts) {
        let accUtxo = 0;
        const hdAccount = await globalState.rpc('gethdaccount', [account.pk]);
        for (let tx of hdAccount) {
          console.log('scanWallet - tx of hdAccount', tx);
          accUtxo = add(accUtxo, tx.account_balance_change);
          accUtxo = format(accUtxo, { precision: 14 });
          txs.push({
            amount: tx.account_balance_change,
            txid: tx.txid,
            blocktime: tx.txinfo.blocktime,
            account: account.label,
            pk: account.pk,
          })
        }
        account.utxo = utxo;
        // When a user looks at their wallet, the software aggregates the sum of value of all their
        // UTXOs and presents it to them as their "balance".
        // Bitcoin doesn’t know balances associated with an account or username as they appear in banking.
        utxo = add(utxo, accUtxo);
        utxo = format(utxo, { precision: 14 });
      }
      resolve({
        utxo: utxo, // sum of all utxo
        txs: txs, // all transactions,
        accounts: accounts,
      });
    });
  }
};

export default CryptoService;
