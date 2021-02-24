import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
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
  seed: null,
  mnemonic: null,
  master: null,
  WIFtoPK(wif = 'KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn') {
    const keyPair = bitcoin.ECPair.fromWIF(wif)
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
    console.log('address retrieved from pk: ', address)
    return address
  },
  generateMnemonicAndSeed() {
    // The root seed is most often represented by a mnemonic word sequence
    this.mnemonic = bip39.generateMnemonic()
    // HD wallets are created from a single root seed, which is a 128-, 256-, or 512-bit random number.
    //  Everything else in the HD wallet is deterministically derived from this root seed,
    // which makes it possible to re-create the entire HD wallet from that seed in any compatible HD wallet
    this.seed = bip39.mnemonicToSeedSync(this.mnemonic) // recovery seed of the master bip32 seed.?
    this.master = bip32.fromSeed(this.seed, this.network)
  },
  isMnemonicValid() {
    const isValid = bip39.validateMnemonic(this.mnemonic)
    return isValid
  },
  generateRandomAddress() {
    const keyPair = bitcoin.ECPair.makeRandom()
    const { address } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: this.network
    })
    // console.log('public key', keyPair.publicKey);
    // keyPair.toWIF()
    return address
  },
  getWalletFromDb() {
    return new Promise((res, rej) => {
      db.find({ name: 'wallet1' } || {}, (err, docs) => {
        if (err) rej(err)
        res(docs)
      })
    })
  },
  storeWalletInDb(password = '123123', pk = 'privatekey') {
    // user security is ultimately dependent on a password,
    // and because a password usually can't be used directly as a cryptographic key,
    //some processing is required
    const salt = cryptoJs.lib.WordArray.random(128 / 8)
    const hash = cryptoJs.PBKDF2(password, salt, {
      keySize: 512 / 32,
      iterations: 1000
    })

    // encrypt private key with hashed password
    let iv = '1234567890123456'
    iv = cryptoJs.enc.Utf8.parse(iv)
    let encryptedPK = cryptoJs.AES.encrypt(pk, hash, { iv: iv })

    // let encryptedPassword = cryptoJs.AES.encrypt(password, key, { iv: iv })
    // encryptedPassword.toString()

    // ask user for password, rehash it, decrypt the private key
    // let decrypted = cryptoJs.AES.decrypt(encryptedPK, hash, { iv: iv })
    // decrypted = decrypted.toString(cryptoJs.enc.Utf8)
    // console.log('decrypted: ', decrypted);
    const wallet = {
      name: 'wallet1',
      address: this.generateRandomAddress(),
      pk: encryptedPK.toString(),
      password: hash.toString(),
      balance: 0
    }

    db.insert(wallet,
        (res) => {
          console.log('stored in db!!!', wallet, res)
        }
      )
  }
}

export default CryptoService
