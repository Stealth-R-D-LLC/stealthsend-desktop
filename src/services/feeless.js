import argon2 from 'argon2-browser';
import { XorShift1024Star } from 'xorshift.js';
import { Buffer } from 'buffer/index.js';



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
    async createFeeworkAndScriptPubkey(txUnsignedHex, blockHeight, blockSize, blockHash) {
      const HEIGHT = blockHeight;
      const SIZE = parseInt(blockSize, 10);
      const BLOCKHASH = blockHash;
  
      const MCOST = this._getMcostFromSize(SIZE);
  
      const DATA = this._getDataBytesFromTxAndHash(txUnsignedHex, BLOCKHASH);
      const SALT = await this._getWinningSalt(DATA, MCOST);
  
      // console.log('HEIGHT     :', HEIGHT);
      // console.log('SIZE       :', SIZE);
      // console.log('BLOCKHASH  :', BLOCKHASH);
      // console.log('MCOST      :', MCOST);
      // console.log('DATA       :', DATA);
      // console.log('SALT       :', SALT);
  
      const scriptPubkeyBuffer = this._writeScriptPubkey(HEIGHT, MCOST, SALT);
      return scriptPubkeyBuffer.toString('hex');
    },
  
    _getMcostFromSize(size) {
      const M = 1000 * 110;
      const BASE = 256;
      let COST = (1 + size / 1000) * BASE;
      let i = 2;
      while (i <= (31 * size) / 204800) {
        COST = parseFloat(parseFloat(COST * M) / 100000);
        i += 1;
      }
      const mcosts = [COST, 4608];
      const MCOST = Number(Math.ceil(Math.min(...mcosts)));
      return MCOST;
    },
  
    _getDataBytesFromTxAndHash(txUnsignedHex, hash) {
      const HASH = Buffer.from(hash, 'hex');
      const TXBYTES = Buffer.from(txUnsignedHex, 'hex');
      const DATA = Buffer.concat([HASH, TXBYTES]);
      // console.log('DATA BYTES: ', DATA);
      // console.log('DATA Hex: ', DATA.toString('hex'));
      return DATA;
    },

    _getOutputCondition() {
      return this._hexToBn('0006ffffffffffff');
    },
  
    async _getWinningSalt(data, mcost) {
      let OUTPUT;
      let SALT;
      const outputCondition = this._getOutputCondition();
      do {
        try {
          const seedDate = Date.now();
          const seed = seedDate.toString(16);
          const prng = new XorShift1024Star(seed);
          SALT = prng.randomBytes(8);
          OUTPUT = await this._getOutputWithArgon2(data, SALT, mcost);
        } catch (e) {
          console.log(`FEELESS: Error in crunching the salt`, e);
          throw new Error(e);
        }
      } while (OUTPUT > outputCondition);
  
      SALT = this._hexToBn(SALT.toString('hex'));
      // OUTPUT = this._hexToBn(OUTPUT);
      return SALT;
    },
  
    async _getOutputWithArgon2(data, salt, mcost) {
      let output = await argon2.hash({
        pass: data,
        salt: salt,
        time: 1,
        mem: mcost,
        hashLen: 8,
        parallelism: 1,
        type: argon2.ArgonType.Argon2d,
      });
      output = output.hashHex;
      return this._hexToBn(output);
    },
  
    _writeScriptPubkey(height, mcost, salt) {
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
      scriptPubkey.writeBigUInt64BE(salt, SALT_OFFSET);
      scriptPubkey.writeUInt8(OP_FEEWORK, OPCODE_OFFSET);
  
      return scriptPubkey;
    },
  
    _hexToBn(hex) {
      if (hex.length % 2) {
        hex = '0' + hex;
      }
      return BigInt('0x' + hex);
    },

    async testCreateFeeworkAndScriptPubkey(txUnsignedHex, blockHeight, blockSize, blockHash, scriptPubkeyHex) {
      let scriptPubkeyBytes = Buffer.from(scriptPubkeyHex, 'hex');
      let salt = Buffer.allocUnsafe(8);
      salt.writeUint8(scriptPubkeyBytes[9]);
      salt.writeUint8(scriptPubkeyBytes[10]);
      salt.writeUint8(scriptPubkeyBytes[11]);
      salt.writeUint8(scriptPubkeyBytes[12]);
      salt.writeUint8(scriptPubkeyBytes[13]);
      salt.writeUint8(scriptPubkeyBytes[14]);
      salt.writeUint8(scriptPubkeyBytes[15]);
      salt.writeUint8(scriptPubkeyBytes[16]);
    
      let data = this._getDataBytesFromTxAndHash(txUnsignedHex, blockHash);
      let mcost = this._getMcostFromSize(blockSize);
      let output = await this._getOutputWithArgon2(data, salt, mcost);
      let outputCondition = this._getOutputCondition();
      let conditionText = "LESS THAN";
      if(output > outputCondition){
        conditionText = "GREATER THAN"
      }

      let result = `ScriptPubkey length is ${Buffer.byteLength(scriptPubkeyBytes)}, 1st element is ${scriptPubkeyBytes[0]}, `;
      result += `18th element is ${scriptPubkeyBytes[17]}. Output is ${output}, which is ${conditionText} `;
      result += `of output condition ${outputCondition}.`;

      return result;
    }
};

export default FeelessJS;