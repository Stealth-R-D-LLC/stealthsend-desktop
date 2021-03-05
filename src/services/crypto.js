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
  // mnemonic: null,
  master: null,
  seed: null,
  async init() {
    let wallet = await db.find({ name: 'wallet' })
    console.log('--------', wallet)
    if (wallet.length) {
      this.master = this.WIFtoPK(wallet[0].master)
      this.seed =this.hexToArray(wallet[0].seed)
    }
    // db.find({name: 'wallet'}, (err, docs) => {
    //   if (!err && docs) {
    //     console.log('--', docs);
    //     CryptoService.master = docs[0].master
    //   }
    // })
  },
  WIFtoPK(wif) {
    const keyPair = bitcoin.ECPair.fromWIF(wif)
    // console.log('keypair: ', keyPair); //
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
    console.log('address retrieved from pk: ', address)
    // return bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
    return keyPair
  },
  hexToArray(hexString) {
    return new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))
  },
  async generateMnemonicAndSeed() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      // generate mnemonic with mouse movement
      // let entropy = await this.generateEntropyWithMouse()
      // console.log('en: ', entropy)
      // this.mnemonic = bip39.entropyToMnemonic(entropy)
      // generate mnemonic with bip39
      const mnemonic = await bip39.generateMnemonic()
      // HD wallets are created from a single root seed, which is a 128-, 256-, or 512-bit random number.
      // Everything else in the HD wallet is deterministically derived from this root seed,
      // which makes it possible to re-create the entire HD wallet from that seed in any compatible HD wallet
      const seed = await bip39.mnemonicToSeedSync(mnemonic) // recovery seed of the master bip32 seed.?
      // console.log('see', seed);
      // console.log('ovo valjda', seed);
      // console.log('ovo valjda1', seed.toString('hex'))
      // console.log('---', this.hexToArray(seed.toString('hex')))
      // console.log('ovo valjda2', seed.toString());
      const master = await bip32.fromSeed(seed) // aka. root
      // console.log('-->>', bip32.fromWIF(seed.toString('hex'), this.network));
      // console.log('master: ', master.keyPair.toWIF())
      this.master = master
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
    // console.log('.1111', this.master, account, change, address)
    const child = this.master.derivePath(
      `m/44'/125'/${account}'/${change}/${address}`
    )
    // console.log('haha', child);
    console.log('---', child.toWIF()) // encrypt
    this.WIFtoPK(child.toWIF()) // decrypt
    return {
      address: bitcoin.payments.p2pkh({ pubkey: child.publicKey }).address,
      pk: child.publicKey,
      sk: child.privateKey
    }
  },
  isMnemonicValid(mnemonic) {
    const isValid = bip39.validateMnemonic(mnemonic)
    return isValid
  },
  // generateRandomAddress() {
  //   const keyPair = bitcoin.ECPair.makeRandom()
  //   const { address } = bitcoin.payments.p2pkh({
  //     pubkey: keyPair.publicKey,
  //     network: this.network
  //   })
  //   // console.log('public key', keyPair.publicKey);
  //   // keyPair.toWIF()
  //   return address
  // },
  generateChildAddress(i) {
    // https://github.com/satoshilabs/slips/blob/master/slip-0044.md
    const path = `m/44'/125'/0'/0/${i}`
    const child1 = this.master.derivePath(path)
    // private key: child1.privateKey
    return bitcoin.payments.p2pkh({ pubkey: child1.publicKey }).address
  },
  getWalletFromDb() {
    return new Promise((res, rej) => {
      db.find({ name: 'wallet' } || {}, (err, docs) => {
        if (err) rej(err)
        res(docs)
      })
    })
  },
  storeWalletInDb(master = this.master, password) {
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
      // let decrypted = cryptoJs.AES.decrypt(encryptedPK, hash, { iv: iv })
      // decrypted = decrypted.toString(cryptoJs.enc.Utf8)
      // console.log('decrypted: ', decrypted);
      console.log('master prije to wif', master)
      const wallet = {
        name: 'wallet',
        archived: false,
        // master: master.derivePath(`m/44'/125'/0'/0/0`).toWIF(),
        seed: this.seed.toString('hex'),
        // address: this.generateRandomAddress(),
        // pk: encryptedPK.toString(), // not necessarry to store, can be derivated from master
        password: hash.toString(),
        balance: 0,
        accounts: []
      }

      db.insert(wallet, () => {
        console.log('stored in db!!!', wallet)
      })

      resolve(wallet)
    })
  },
  generateEntropyWithMouse() {
    return new Promise((resolve) => {
      const entropy = []
      let captureStart = false

      document.addEventListener('mousemove', function(e) {
        const MAX_LEN = 32 // size of entropy's array
        if (entropy.length >= MAX_LEN) return
        const now = Date.now()
        if (now >= 1 && now % 10 !== 0) return
        if (!captureStart) {
          return setTimeout(() => {
            captureStart = true
          }, 1500) // capturing starts in 1.5 seconds to set the mouse cursor at random position...
        }
        const iw = window.innerWidth
        const ih = window.innerHeight
        const iwPlusIh = iw + ih
        const px = e.pageX
        const py = e.pageY
        const pxPlusPy = px + py
        const ret = Math.round((pxPlusPy / iwPlusIh) * 255)
        entropy.push(ret)
        if (entropy.length >= MAX_LEN) {
          shuffle(entropy)
          let len = String(Math.floor(entropy.join('').length) / 4)
          resolve(entropy.slice(0, len))
        }

        function shuffle(array) {
          let currentIndex = array.length,
            temporaryValue,
            randomIndex
          // While there remain elements to shuffle...
          while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1
            // And swap it with the current element.
            temporaryValue = array[currentIndex]
            array[currentIndex] = array[randomIndex]
            array[randomIndex] = temporaryValue
          }
          return array
        }
      })
    })
  }
}

export default CryptoService
