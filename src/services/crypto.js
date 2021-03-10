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
    if (wallet.length) {
      console.log('wallet: ', wallet)
      // seed is stored in a string format because it's the easies to store
      // when retrieving, we need to have the seed in buffer type so we can work with it
      // that's why we are converting the seed from string -> uint8array -> buffer
      this.seed = this.hexToArray(wallet[0].seed)
      this.master = await bip32.fromSeed(Buffer.from(this.seed))
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
      address: bitcoin.payments.p2pkh({ pubkey: child.publicKey, network: this.network }).address,
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
    return bitcoin.payments.p2pkh({ pubkey: child1.publicKey, network: this.network }).address
  },
  async getWalletFromDb() {
    let wallet = await db.find({ name: 'wallet' })
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
    await db.update({ name: 'account', address: account.address }, {
      name: 'account',
      address: account.address,
      label: account.label,
      isArchived: true,
      balance: account.balance,
      path: account.path
    })
    await this.getAccounts()
  },
  storeWalletInDb(password) {
    return new Promise((resolve) => {
      // user security is ultimately dependent on a password,
      // and because a password usually can't be used directly as a cryptographic key,
      //some processing is required
      const salt = cryptoJs.lib.WordArray.random(128 / 8)
      const hash = cryptoJs.PBKDF2(password, salt, {
        keySize: 512 / 32,
        iterations: 1000
      })

      // encrypt private key with hashed password
      // let iv = '1234567890123456'
      // iv = cryptoJs.enc.Utf8.parse(iv)
      // let encryptedPK = cryptoJs.AES.encrypt(pk, hash, { iv: iv })

      // let encryptedPassword = cryptoJs.AES.encrypt(password, key, { iv: iv })
      // encryptedPassword.toString()

      // ask user for password, rehash it, decrypt the private key
      // let decrypted = cryptoJs.AES.decrypt(encryptedPK, hash)
      // decrypted = decrypted.toString(cryptoJs.enc.Utf8)
      // console.log('decrypted pass: ', decrypted);
      const wallet = {
        name: 'wallet',
        archived: false,
        seed: this.seed.toString('hex'), // nicest way to store seed is in hex string format
        password: hash.toString(),
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
