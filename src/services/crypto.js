import globalState from '@/store/global'
import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
import { Buffer } from 'buffer'
import cryptoJs from 'crypto-js'
import db from '../db'

const CryptoService = {
  network: {
    messagePrefix: '\x18Stealth Testnet Signed Message:\n',
    bech32: 'tb', // address format specified by BIP173
    bip32: {
      // address path. defines how to derive private and public keys of a wallet from a binary master seed (m) and an ordered set of indices
      public: 0x043587cf,
      private: 0x04358394
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
    console.log('wallet: ', wallet)
    if (wallet.length > 0) {
      // seed is stored in a string format because it's the easies to store
      // when retrieving, we need to have the seed in buffer type so we can work with it
      // that's why we are converting the seed from string -> uint8array -> buffer
      let { hashHex } = await this.hashPassword('123123')
      console.log('seed u init kriptirani: ', wallet[0].seed);
      console.log('seed pokusaj dec: ', cryptoJs.AES.decrypt(wallet[0].seed, hashHex));
      // console.log('seed pokusaj uint16arr: ', cryptoJs.enc.Hex.parse(wallet[0].seed.ciphertext.toString(cryptoJs.enc.Hex)));
      // this.seed = this.hexToArray(
      //   cryptoJs.AES.decrypt(wallet[0].seed, hashHex).toString(cryptoJs.enc.Hex)
      // )
      // TODO: tu nesto ne valja. provjeriti jel se dobro dekriptira seed
      this.master = await bip32.fromSeed(Buffer.from(cryptoJs.AES.decrypt(wallet[0].seed, hashHex).words))
    }
  },
  WIFtoPK(wif) {
    const keyPair = bitcoin.ECPair.fromWIF(wif)
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
    const child = this.master.derivePath(
      `m/44'/125'/${account}'/${change}/${address}`
    )
    this.WIFtoPK(child.toWIF()) // decrypt
    return {
      address: bitcoin.payments.p2pkh({
        pubkey: child.publicKey,
        network: this.network
      }).address,
      pk: child.publicKey,
      sk: child.privateKey,
      path: `${account}'/${change}/${address}`
    }
  },
  isMnemonicValid(mnemonic) {
    const isValid = bip39.validateMnemonic(mnemonic)
    return isValid
  },
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
  async getWalletFromDb() {
    let wallet = await db.find({ name: 'wallet' })
    console.log('voljet', wallet);
    globalState.setWallet(wallet[0])
    return wallet
  },
  async getAccounts() {
    let accounts = await db.find({ name: 'account' })
    globalState.setAccounts(accounts)
    console.log('accounts: ', accounts)
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
      asset: account.asset
    })
    console.log('account stored in db: ', acc)
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
  async hashPassword(password) {
    let wallet = await this.getWalletFromDb()

    const salt = wallet[0].salt
    const hash = cryptoJs.PBKDF2(password, salt, {
      keySize: 512 / 32,
      iterations: 1000
    })
    console.log('passses', {
      storedPassword: wallet[0].password,
      hash: hash,
      hashHex: hash.toString(cryptoJs.enc.Hex)
    });
    return {
      storedPassword: wallet[0].password,
      hash: hash,
      hashHex: hash.toString(cryptoJs.enc.Hex)
    }
  },
  async validatePassword(password) {
    let { hashHex, storedPassword } = await this.hashPassword(password)
    // console.log('newly hashed: ', hashHex);
    // console.log('stored pass hash: ', storedPassword);
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
      const encryptedSeed = cryptoJs.AES.encrypt(
        this.seed.toString('hex'),
        hash.toString(cryptoJs.enc.Hex)
      )
      console.log('seed', this.seed);
      console.log('seed hex', this.seed.toString('hex'));
      console.log('pokusaj smrti', this.hexToArray(this.seed.toString('hex')));
      console.log('enc seed encrypted raw', encryptedSeed);
      console.log('enc seed stored: ', encryptedSeed.ciphertext.toString(cryptoJs.enc.Hex));
      console.log('decrypted', cryptoJs.AES.decrypt(encryptedSeed, hash.toString(cryptoJs.enc.Hex)).toString(cryptoJs.enc.Utf8));
      console.log('parsed: ', cryptoJs.enc.Hex.parse(encryptedSeed.ciphertext.toString(cryptoJs.enc.Hex)));

      const wallet = {
        name: 'wallet',
        archived: false,
        seed: encryptedSeed.ciphertext.toString(cryptoJs.enc.Hex),
        password: hash.toString(cryptoJs.enc.Hex),
        balance: 0, // will be calculated after "scanning" for accounts; sum of all accounts
        accounts: [], // will be populated after "scanning",
        salt: salt
      }

      db.insert(wallet, () => {
        console.log('wallet stored in db: ', wallet)
      })
      
      resolve(wallet)
    })
  }
}

export default CryptoService
