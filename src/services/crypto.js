import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'

const CryptoService = {
  seed: null,
  mnemonic: null,
  async generateMnemonicAndSeed() {
    this.mnemonic = bip39.generateMnemonic()
    this.seed = await bip39.mnemonicToSeed(this.mnemonic)
  },
  isMnemonicValid() {
    const isValid = bip39.validateMnemonic(this.mnemonic)
    return isValid
  },

  generateRadnomAddress() {
    const keyPair = bitcoin.ECPair.makeRandom();
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    return address;
}
}

export default CryptoService
