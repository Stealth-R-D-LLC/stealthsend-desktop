import globalState from '@/store/global'
import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
import { Buffer } from 'buffer'
import cryptoJs from 'crypto-js'
import db from '../db'

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
  wallet: null,
  async init() {
    // check if there's already a wallet stored in the db
    // if so, retrieve it and generate the master from the stored seed
    let wallet = await this.getWalletFromDb()
    await this.getAccounts()
    console.log('Wallet: ', wallet)
    if (wallet.length > 0) {
      // seed is stored in a string format because it's the easies to store
      // when retrieving, we need to have the seed in buffer type so we can work with it
      // that's why we are converting the seed from string -> uint8array -> buffer
      let { hashHex } = await this.hashPassword('123123')
      // console.log('seed u init kriptirani: ', wallet[0].seed);
      // console.log('seed pokusaj dec: ', cryptoJs.AES.decrypt(wallet[0].seed, hashHex));
      // console.log('seed pokusaj uint16arr: ', this.hexToArray(
      //   cryptoJs.AES.decrypt(wallet[0].seed, hashHex).toString(cryptoJs.enc.Hex)
      // ));
      // this.seed = this.hexToArray(
      //   cryptoJs.AES.decrypt(wallet[0].seed, hashHex).toString(cryptoJs.enc.Hex)
      // )
      // TODO: tu nesto ne valja. provjeriti jel se dobro dekriptira seed
      this.master = await bip32.fromSeed(Buffer.from(cryptoJs.AES.decrypt(wallet[0].seed, hashHex).words), this.network)
      console.log('master!', this.master);
      // this.accountDiscovery()
    }
  },
  WIFtoPK(wif) {
    const keyPair = bitcoin.ECPair.fromWIF(wif, this.network)
    // const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: this.network })
    return keyPair
  },
  hexToArray(hexString) {
    // convert hex string to uint8array
    // helper for seed
    return new Uint8Array(
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    )
  },
  async generateMnemonicAndSeed() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      // HD wallets are created from a single root seed, which is a 128-, 256-, or 512-bit random number.
      // Everything else in the HD wallet is deterministically derived from this root seed,
      // which makes it possible to re-create the entire HD wallet from that seed in any compatible HD wallet
      const mnemonic = await bip39.generateMnemonic()
      const seed = await bip39.mnemonicToSeedSync(mnemonic) // recovery seed of the master bip32 seed.?
      const master = await bip32.fromSeed(seed) // aka. root
      this.master = master
      this.seed = seed
      // console.log('mnemonic: ', this.mnemonic)
      // console.log('seed: ', this.seed)
      // console.log('master: ', this.master)
      resolve({
        mnemonic,
        // seed,
        master
      })
    })
  },
  getChildFromRoot(account, change, address) {
    // child === keypair
    console.log('getChildFromRoot');
    const child = this.master.derivePath(
      `m/44'/1'/${account}'/${change}/${address}`
    )
    let acc = this.master.derivePath(
      `m/44'/1'/${account}'`
    )
    // this.WIFtoPK(child.toWIF()) // decrypt
    return {
      address: bitcoin.payments.p2pkh({
        pubkey: child.publicKey,
        network: this.network
      }).address,
      keyPair: child,
      pk: String(acc.neutered().toBase58()),
      wif: child.toWIF(),
      // sk: child.privateKey,
      path: `${account}'/${change}/${address}`
    }
  },
  isMnemonicValid(mnemonic) {
    const isValid = bip39.validateMnemonic(mnemonic)
    return isValid
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
    let wallet = await db.find({ name: 'wallet' })
    globalState.setWallet(wallet[0])
    return wallet
  },
  async getAccounts() {
    let accounts = await db.find({ name: 'account' })
    globalState.setAccounts(accounts)
    console.log('Accounts: ', accounts)
    return accounts
  },
  async storeAccountInDb(account) {
    let acc = await db.insert({
      name: 'account',
      address: account.address,
      label: account.label,
      isArchived: account.isArchived,
      balance: account.balance,
      path: account.path,
      pk: account.pk,
      asset: account.asset
    })
    this.getAccounts()
    return acc
  },
  async archiveAccount(account) {
    await db.update(
      { name: 'account', address: account.address },
      {
        name: 'account',
        address: account.address,
        label: account.label,
        isArchived: true,
        balance: account.balance,
        path: account.path
      }
    )
    await this.getAccounts()
  },
  async unarchiveAccount(account) {
    await db.update(
      { name: 'account', address: account.address },
      {
        name: 'account',
        address: account.address,
        label: account.label,
        isArchived: false,
        balance: account.balance,
        path: account.path
      }
    )
    await this.getAccounts()
  },
  async hashPassword(password) {
    let wallet = await this.getWalletFromDb()

    const salt = wallet[0].salt
    const hash = cryptoJs.PBKDF2(password, salt, {
      keySize: 512 / 32,
      iterations: 1000
    })
    // console.log('passses', {
    //   storedPassword: wallet[0].password,
    //   hash: hash,
    //   hashHex: hash.toString(cryptoJs.enc.Hex)
    // });
    return {
      storedPassword: wallet[0].password,
      hash: hash,
      hashHex: hash.toString(cryptoJs.enc.Hex)
    }
  },
  async validatePassword(password) {
    // receive password as plain text, hash it, compare it with existing hash in db
    let { hashHex, storedPassword } = await this.hashPassword(password)
    console.log('newly hashed: ', hashHex);
    console.log('stored pass hash: ', storedPassword);
    return hashHex === storedPassword
  },
  storeWalletInDb(password) {
    return new Promise((resolve) => {
      // user security is ultimately dependent on a password,
      // and because a password usually can't be used directly as a cryptographic key,
      // some processing is required
      // hash the password and store it in the db. PBKDF2 is a one-way hashing algorithm
      // we'll use the hash to encrypt sensitive data like the seed
      const salt = cryptoJs.lib.WordArray.random(128 / 8)
      const hash = cryptoJs.PBKDF2(password, salt, {
        keySize: 512 / 32,
        iterations: 1000
      })

      // encrypt the seed with the hashed password
      // to decrypt the seed, we need to ask the user for his password and then hash it again.
      // if the resulted hash is the same as the hashed password,
      // then the user entered the correct password and the seed can be decrypted
      // console.log('sid', this.seed);
      // console.log('hash', hash);
      const encryptedSeed = cryptoJs.AES.encrypt(
        this.seed.toString('hex'),
        hash.toString(cryptoJs.enc.Hex)
      )
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
        seed: encryptedSeed.ciphertext.toString(cryptoJs.enc.Hex),
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
      const acc = this.getChildFromRoot( n, 0, i)
      console.log('acc', acc);
      // scan addresses of the external chain; respect the gap limit described below
      const inputs = await globalState.rpc('getaddressinputs', [acc.address, 1, 10])
      if (inputs.length > 0) {
        console.log('discovered account: ',  acc);
        // save account in db?
        this.storeAccountInDb({
          address: acc.address,
          path: acc.path,
          pk: acc.pk, 
          name: 'account',
          label: 'Account ' + i + 1,
          isArchived: false,
          balance: 0,
          asset: 'XST'
        })
        // get account balance
        // if there are some transactions, increase the account index and go to step 1
        // this.accountDiscovery(n+1)
        emptyInARow = 0
        continue
      }
      // if there are no transactions, increment counter and go to next address
      emptyInARow += 1;

      // If the software hits 20 unused addresses in a row, it expects there are no used addresses beyond this point and stops searching the address chain
      if (emptyInARow >= 20) break
    }
    // grace concert hunt glide million orange enact habit amazing deal object nurse

  }
}

export default CryptoService
