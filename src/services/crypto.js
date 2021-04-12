// @ts-check
import router from '@/router';
import globalState from '@/store/global';
import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
import { Buffer } from 'buffer'
import cryptoJs from 'crypto-js'
import db from '../db'

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
  // password: '',

  async init() {
    // check if there's already a wallet stored in the db
    // if so, ask for password via lock screen and
    // retrieve the stored wallet and generate the master from the stored seed
    let wallet = await this.getWalletFromDb();
    await this.getAccounts();
    console.log('+Wallet: ', wallet);
    if (wallet.length <= 0) {
      router.push('/welcome');
    } else if (this.isFirstArrival) {
      router.push('/lock');
      this.isFirstArrival = false;
    }
    this.scanWallet()

    // TODO: My tests (Josip)
    // const result = await this.generateMnemonicAndSeed();
    // // console.log('result - mnemonic and seed', result);
    // const isMnemonicValid = this.isMnemonicValid(result.mnemonic);
    // console.log('valid mnemonic?', isMnemonicValid);
    // console.log('this.network', this.network);
    // console.log('convert WIF to PK');
    // const keyPair = this.WIFtoPK(this.network.wif.toString());
    // console.log('keyPair', keyPair);
    // const child = this.master.derivePath(`m/44'/1'/${this.account}/${this.change}/${this.network.pubKeyHash}`);
    // console.log('child', child)

  },
  /**
   *
   * @param {string} password
   */
  async unlock(password) {
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
    // // console.log('dec', cryptoJs.AES.decrypt(wallet[0].seed, hash));
    // console.log('deccc', this.AESDecrypt(wallet[0].seed, hash));
    this.master = bip32.fromSeed(Buffer.from(this.hexToArray(this.AESDecrypt(wallet[0].seed, hash.toString(cryptoJs.enc.Hex)).toString(cryptoJs.enc.Utf8))), this.network);
    console.log('unlock and set master -> this.master', this.master);
    // console.log('master!', this.master);
    router.push('/dashboard')
    // this.accountDiscovery()
  },
  /**
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
  async generateMnemonicAndSeed() {
    console.log('generateMnemonicAndSeed');
    // HD wallets are created from a single root seed, which is a 128-, 256-, or 512-bit random number.
    // Everything else in the HD wallet is deterministically derived from this root seed,
    // which makes it possible to re-create the entire HD wallet from that seed in any compatible HD wallet
    const mnemonic = bip39.generateMnemonic(); // string
    const seed = bip39.mnemonicToSeedSync(mnemonic); // recovery seed of the master bip32 seed.? - seed buffer
    const master = bip32.fromSeed(seed, this.network); // aka. root
    this.master = master;
    this.seed = seed;
    return {
      mnemonic,
      master
    }
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
  /**
   *
   * @param {string} account
   * @param {string} change
   * @param {string} address
   * @return {object}
   */
  getChildFromRoot(account, change, address) {
    // child === keypair
    console.log('getChildFromRoot', account, change, address); // 1 0 0
    const child = this.master.derivePath(
      `m/44'/1'/${account}'/${change}/${address}`
    );
    let acc = this.master.derivePath(
      `m/44'/1'/${account}'`
    );
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
    let wallet = await db.find({ name: 'wallet' });
    globalState.setWallet(wallet[0]);
    return wallet;
  },
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
    let acc = await db.insert({
      name: 'account',
      address: account.address,
      label: account.label,
      isArchived: account.isArchived,
      balance: account.balance,
      path: account.path,
      pk: account.pk,
      asset: account.asset,
    });
    await this.getAccounts(); // TODO: get accounts, and what after we've got them? Maybe we need to get the results of db.insert
    return acc;
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
        balance: account.balance,
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
        balance: account.balance,
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
    let { hash, salt } = await this.hashPassword(password)
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
        balance: 0, // will be calculated after "scanning" for accounts; sum of all accounts
        salt: salt
      }

      db.insert(wallet, () => {
        console.log('wallet stored in db: ', wallet)
      })

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
      // console.log('acc.address', acc.address);
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
          balance: 0,
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
   * @param {string} payload
   * @param {string} key
   * @return {Object}
   */
  AESDecrypt(payload, key = '123456789') {
    let decData = cryptoJs.enc.Base64.parse(payload).toString(cryptoJs.enc.Utf8);
    let bytes = cryptoJs.AES.decrypt(decData, key).toString(cryptoJs.enc.Utf8);
    return JSON.parse(bytes);
  },
  async scanWallet() {
    console.log('sken voljet');
    // initially scan all accounts in the wallet for utxos
    // gethdaccounts retrieves all transactions for a particular account
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      let utxo = 0;
      const accounts = await this.getAccounts();
      for (let account of accounts) {
        const hdAccount = await globalState.rpc('gethdaccount', [account.pk]);
        console.log('hd account ', hdAccount);
        for (let tx of hdAccount) {
          utxo += tx.account_balance_change;
        }

      }
      resolve(utxo);
    });
  }
};

export default CryptoService;
