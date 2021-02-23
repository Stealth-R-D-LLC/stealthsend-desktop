import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
import cryptoJs from 'crypto-js'
import db from '../db'

const CryptoService = {
  seed: null,
  mnemonic: null,
  master: null,
  WIFtoPK(wif = 'KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn') {
    const keyPair = bitcoin.ECPair.fromWIF(wif)
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
    console.log('address retrieved from pk: ', address);
    return address
  },
  async generateMnemonicAndSeed() {
    this.mnemonic = bip39.generateMnemonic()
    this.seed = await bip39.mnemonicToSeed(this.mnemonic) // actual master key
    // this.master = bip32.fromSeed(this.seed)
  },
  isMnemonicValid() {
    const isValid = bip39.validateMnemonic(this.mnemonic)
    return isValid
  },
  generateRandomAddress() {
    const keyPair = bitcoin.ECPair.makeRandom()
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
    // console.log('public key', keyPair.publicKey);
    // keyPair.toWIF()
    return address
  },
  getPk() {
    return new Promise((res, rej) => {
      db.find({ name: 'matej' } || {}, (err, docs) => {
        if (err) rej(err)
        res(docs)
      })
    })
  },
  storePKinDB(password = '123123', pk = 'privatekey') {
    // encrypt PK with password
    // store password in db
    //   const pk = 'pk';
    // const salt = cryptoJs.lib.WordArray.random(128 / 8)
    // const hash = cryptoJs.PBKDF2(password, salt, {
    //   keySize: 512 / 32,
    //   iterations: 1000
    // })

    let key = '12345678901234567890123456789012'
    key = cryptoJs.enc.Utf8.parse(key)

    let iv = '1234567890123456'
    iv = cryptoJs.enc.Utf8.parse(iv)

    let encryptedPK = cryptoJs.AES.encrypt(pk, key, { iv: iv })
    // encryptedPK.toString()

    let encryptedPassword = cryptoJs.AES.encrypt(password, key, { iv: iv })
    // encryptedPassword.toString()

    // let decrypted = cryptoJs.AES.decrypt(encrypted, key, { iv: iv })
    // decrypted = decrypted.toString(cryptoJs.enc.Utf8)
    db.insert(
      {
        name: 'matej',
        pk: encryptedPK.toString(),
        password: encryptedPassword.toString(),
        balance: 0
      },
      () => {
        console.log('stored in db!')
      }
    )
  }
}

export default CryptoService
