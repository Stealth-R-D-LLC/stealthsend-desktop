import argon2 from 'argon2-browser';
import { XorShift1024Star } from 'xorshift.js';
import { Buffer } from 'buffer/';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import CryptoService from '@/services/crypto';

// Pseudo Code

// Q2: HEIGHT = Get current chain height (e.g. getbestblock RPC), big endian 32 bit unsigned int

// Q3: Determine COST using SIZE (in bytes) of best block to estimate
// M = 1000 * (110)
// BASE = 256
// COST = (1 + SIZE/1000) * BASE
// i = 2
// while i <= (31 * SIZE) / 204800:
//   COST = (COST * M) / 100000
//   i = i+1
// # max possible hardness is 4608 desktop, 1024 mobile (suggested)
// MCOST = min(COST, 1024)

// Q4: Determine HASH of best block, decoded (i.e. bytes, not hex string)

// Q5: Get decoded unsigned (signatures blanked) serialized transaction TXBYTES (i.e., not hex)

// Q6: Feework data is catenated: DATA = HASH + TXBYTES

// Q7: Create starting SALT = XORShift1024*.next()
// The object XORShift1024* is a PRNG (https://arxiv.org/abs/1810.05313) available in
// many programming languages. It’s next() function returns a new pseudo-random number
// every time it is called. Initialize with time as a seed. There is no need to worry
// about cryptographic security for these random numbers.

// Q8: Calculate feework 8 byte OUTPUT using Argon2d (https://github.com/P-H-C/phc-winner-argon2)
// OUTPUT = Argon2d(MCOST, DATA, SALT, TCOST=1, PARALLELISM=1)
// Calculate feework 8 byte OUTPUT using
// if OUTPUT > 0x0006ffffffffffff:
//     goto step 6

// The OUTPUT is discarded, but the final SALT is kept for the FEEWORK. Catenate:

// FEEWORK = HEIGHT + MCOST + SALT + OP_FEEWORK

// HEIGHT is 32 bit unsigned int, big endian
// MCOST is 32 bit unsigned int, big endian
// SALT is 8 bytes (created by PRNG as 64 bit unsigned int, big endian)
// OP_FEEWORK is 0xd1 (209) as 32 bit int, big endian

// FEEWORK is the scriptPubKey for an output with 0 value. Append this 0 value output
// to the raw transaction and sign the whole transaction. Feework transactions
// MUST be version 4, so the hash of the unsigned transaction needs to be prepended
// to calculate the sighash, which is signed as part of the input signature. This is
// not done in any standard library, so a custom signature routine needs to be created
// for this part.

const FeelessJS = {
  async createFeeworkAndScriptPubkey(
    inputsLength,
    txUnsignedHex,
    blockHeight,
    blockSize,
    blockHash
  ) {
    const HEIGHT = blockHeight;
    const SIZE = blockSize;
    let BLOCKHASH = blockHash;

    function _getBytesSize(txUnsignedHex, inputsLength) {
      var BYTES_SIZE = txUnsignedHex.length / 2;
      BYTES_SIZE = BYTES_SIZE + inputsLength * 108 + 18; // 108 for each input and 18 for feeless
      return BYTES_SIZE;
    }

    const BYTES_SIZE = _getBytesSize(txUnsignedHex, inputsLength);

    console.log('BYTES_SIZE', JSON.stringify(BYTES_SIZE));

    BLOCKHASH = BLOCKHASH.match(/.{1,2}/g)
      .reverse()
      .join('');

    const MCOST = this._getMcostFromSize(SIZE, BYTES_SIZE);
    const DATA = this._getDataBytesFromTxAndHash(txUnsignedHex, BLOCKHASH);
    const WORK = await this._createWork(DATA, MCOST);
    const scriptPubkeyBuffer = this._writeScriptPubkey(HEIGHT, MCOST, WORK);
    return scriptPubkeyBuffer.toString('hex');
  },

  _getMcostFromSize(size, bytes) {
    const M = 1000 * 110;
    const BASE = 256;
    const MAXSIZE = 200000;
    let COST = (1 + bytes / 1000) * BASE;
    let NEWSIZE = size + bytes;

    if (NEWSIZE > MAXSIZE) {
      NEWSIZE = MAXSIZE;
    }

    let i = 2;
    while (i <= (31 * NEWSIZE) / MAXSIZE) {
      COST = (COST * M) / 100000;
      i += 1;
    }

    const mcosts = [COST, 4608];
    const MCOST = Number(Math.ceil(Math.min(...mcosts)));
    return MCOST;
  },

  _getDataBytesFromTxAndHash(txUnsignedHex, hash) {
    function hexStringToByteArray(hexString) {
      if (hexString.length % 2 !== 0) {
        throw 'Must have an even number of hex digits to convert to bytes';
      }
      var numBytes = hexString.length / 2;
      var byteArray = new Uint8Array(numBytes);
      for (var i = 0; i < numBytes; i++) {
        byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
      }
      return byteArray;
    }
    function concatUint8(arrays) {
      // sum of individual array lengths
      let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);

      if (!arrays.length) return null;

      let result = new Uint8Array(totalLength);

      // for each array - copy it over result
      // next array is copied right after the previous one
      let length = 0;
      for (let array of arrays) {
        result.set(array, length);
        length += array.length;
      }

      return result;
    }
    const HASH = hexStringToByteArray(hash);
    const TXBYTES = hexStringToByteArray(txUnsignedHex);
    const DATA = concatUint8([HASH, TXBYTES]);
    return DATA;
  },

  _getLimitDenary() {
    return this._hexToBn('0006ffffffffffff');
  },

  async _createWork(data, mcost) {
    var HASH_DENARY;
    var WORK;
    const LIMIT_DENARY = this._getLimitDenary();
    var start = new Date();
    console.time('FEELESS work_calc');
    do {
      try {
        let curr = new Date();
        const seedDate = Date.now();
        const seed = seedDate.toString(16);
        const prng = new XorShift1024Star(seed);
        const randomBytes = prng.randomBytes(8);
        WORK = Buffer.from(randomBytes);
        HASH_DENARY = await this._getHashWithArgon2(data, WORK, mcost);
        if (
          differenceInSeconds(curr, start) >=
          CryptoService.constraints.FEELESS_CALCULATION_TIME_LIMIT_SECONDS
        ) {
          throw new Error('Feeless calculation time exceeded!');
        }
      } catch (e) {
        console.log(`FEELESS: Error in crunching the WORK`, e);
        throw new Error(e);
      }
    } while (HASH_DENARY > LIMIT_DENARY);
    console.log('HASH_DENARY', HASH_DENARY);
    console.log('LIMIT_DENARY', LIMIT_DENARY);
    console.log('WORK bytes', WORK);
    console.log('WORK bytes readBigUInt64BE', WORK.readBigUInt64BE());
    console.log('WORK bytes to hex to bn', this._hexToBn(WORK.toString('hex')));
    WORK = WORK.readBigUInt64BE();
    console.log('WORK hex', WORK);
    console.log('RETURN');
    console.timeEnd('FEELESS work_calc');
    return WORK;
  },

  async _getHashWithArgon2(data, work, mcost) {
    let hash = await argon2.hash({
      pass: data,
      salt: work,
      time: 1,
      mem: mcost,
      hashLen: 8,
      parallelism: 1,
      type: argon2.ArgonType.Argon2d,
    });
    hash = hash.hashHex;
    return this._hexToBn(hash);
  },

  _writeScriptPubkey(height, mcost, work) {
    const OP_FEEWORK = 209; // 0xd1 or 209
    const FEEWORK_SIZE = 18;
    const HEIGHT_OFFSET = 1;
    const MCOST_OFFSET = 5;
    const SALT_OFFSET = 9;
    const OPCODE_OFFSET = 17;

    const scriptPubkey = Buffer.allocUnsafe(FEEWORK_SIZE);

    scriptPubkey.writeUInt8(16, 0); // 0x10 or 16
    scriptPubkey.writeUInt32BE(height, HEIGHT_OFFSET);
    scriptPubkey.writeUInt32BE(mcost, MCOST_OFFSET);
    scriptPubkey.writeBigUInt64BE(work, SALT_OFFSET);
    scriptPubkey.writeUInt8(OP_FEEWORK, OPCODE_OFFSET);

    return scriptPubkey;
  },

  _hexToBn(hex) {
    if (hex.length % 2) {
      hex = '0' + hex;
    }
    return BigInt('0x' + hex);
  },
};

export default FeelessJS;
