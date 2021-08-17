const argon2 = require('argon2-browser');
const { XorShift1024Star } = require('xorshift.js');
const { Buffer } = require('buffer/index.js');

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
    txUnsignedHex,
    blockHeight,
    blockSize,
    blockHash
  ) {
    const HEIGHT = blockHeight;
    const SIZE = blockSize;
    const BLOCKHASH = blockHash;

    const MCOST = this._getMcostFromSize(SIZE);

    const DATA = this._getDataBytesFromTxAndHash(txUnsignedHex, BLOCKHASH);
    const WORK = await this._createWork(DATA, MCOST);

    // console.log('HEIGHT     :', HEIGHT);
    // console.log('SIZE       :', SIZE);
    // console.log('BLOCKHASH  :', BLOCKHASH);
    // console.log('MCOST      :', MCOST);
    // console.log('DATA       :', DATA);
    // console.log('WORK       :', WORK);

    const scriptPubkeyBuffer = this._writeScriptPubkey(HEIGHT, MCOST, WORK);
    return scriptPubkeyBuffer.toString('hex');
  },

  _getMcostFromSize(size) {
    const M = 1000 * 110;
    const BASE = 256;
    let COST = (1 + size / 1000) * BASE;
    let i = 2;
    while (i <= (31 * size) / 204800) {
      COST = (COST * M) / 100000;
      i += 1;
    }
    const mcosts = [COST, 4608];
    const MCOST = Number(Math.ceil(Math.min(...mcosts)));
    return MCOST;
  },

  _getDataBytesFromTxAndHash(txUnsignedHex, hash) {
    const HASH = Buffer.from(hash);
    const TXBYTES = Buffer.from(txUnsignedHex);
    const DATA = Buffer.concat([HASH, TXBYTES]);
    // console.log('DATA BYTES: ', DATA);
    // console.log('DATA Hex: ', DATA.toString('hex'));
    return DATA;
  },

  _getLimitDenary() {
    return this._hexToBn('0006ffffffffffff');
  },

  async _createWork(data, mcost) {
    let HASH_DENARY;
    let WORK;
    const LIMIT_DENARY = this._getLimitDenary();
    do {
      try {
        const seedDate = Date.now();
        const seed = seedDate.toString(16);
        const prng = new XorShift1024Star(seed);
        const randomBytes = prng.randomBytes(8);
        WORK = Buffer.from(randomBytes);
        HASH_DENARY = await this._getHashWithArgon2(data, WORK, mcost);
      } catch (e) {
        console.log(`FEELESS: Error in crunching the WORK`, e);
        throw new Error(e);
      }
    } while (HASH_DENARY > LIMIT_DENARY);
    console.log('HASH_DENARY', HASH_DENARY);
    console.log('LIMIT_DENARY', LIMIT_DENARY);
    console.log('WORK bytes', WORK);
    console.log('WORK bytes readBigUInt64BE', WORK.readBigUInt64BE());
    console.log(
      'WORK bytes to hex to bn',
      this._hexToBn(WORK.toString('hex'))
    );
    WORK = WORK.readBigUInt64BE();
    console.log('WORK hex', WORK);
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
    const WORK_OFFSET = 9;
    const OPCODE_OFFSET = 17;

    const scriptPubkey = Buffer.allocUnsafe(FEEWORK_SIZE);

    scriptPubkey.writeUInt8(16, 0); // 0x10 or 16
    scriptPubkey.writeUInt32BE(height, HEIGHT_OFFSET);
    scriptPubkey.writeUInt32BE(mcost, MCOST_OFFSET);
    scriptPubkey.writeBigUInt64BE(work, WORK_OFFSET);
    scriptPubkey.writeUInt8(OP_FEEWORK, OPCODE_OFFSET);

    return scriptPubkey;
  },

  _hexToBn(hex) {
    if (hex.length % 2) {
      hex = '0' + hex;
    }
    return BigInt('0x' + hex);
  },

  async testCreateFeeworkAndScriptPubkey(
    txUnsignedHex,
    blockHeight,
    blockSize,
    blockHash,
    scriptPubkeyHex
  ) {
    let scriptPubkeyBytes = Buffer.from(scriptPubkeyHex, 'hex');
    let work = Buffer.allocUnsafe(8);
    work.writeUint8(scriptPubkeyBytes[9], 0);
    work.writeUint8(scriptPubkeyBytes[10], 1);
    work.writeUint8(scriptPubkeyBytes[11], 2);
    work.writeUint8(scriptPubkeyBytes[12], 3);
    work.writeUint8(scriptPubkeyBytes[13], 4);
    work.writeUint8(scriptPubkeyBytes[14], 5);
    work.writeUint8(scriptPubkeyBytes[15], 6);
    work.writeUint8(scriptPubkeyBytes[16], 7);

    let data = this._getDataBytesFromTxAndHash(txUnsignedHex, blockHash);
    let mcost = this._getMcostFromSize(blockSize);
    let hashDenary = await this._getHashWithArgon2(data, work, mcost);
    let limitDenary = this._getLimitDenary();
    let conditionText = 'LESS THAN';
    if (hashDenary > limitDenary) {
      conditionText = 'GREATER THAN';
    }

    let workDenary = this._hexToBn(work.toString('hex'));
    let result = `ScriptPubkey length is ${Buffer.byteLength(
      scriptPubkeyBytes
    )}, 1st element is ${scriptPubkeyBytes[0]}, `;
    result += `18th element is ${scriptPubkeyBytes[17]}. Hash denary is ${hashDenary}, which is ${conditionText} `;
    result += `of limit denary ${limitDenary}. Work denary is ${workDenary}`;

    return result;
  },

  async test_create_feework_and_script_pubkey() {
      let tx_unsigned_hex = "0400000002210ecf588314e42044779cdd3ae4d261de6f74da964e3ff371e4aeb3dc6ef6a40000000000ffffffffd47cac8d822b969c65901407614c5abd089b46df6091f9c6bd2e01409c418f290000000000ffffffff02f0490200000000001976a91497ffe061435ece8dcf7431d226583711c1c5611c88acf09c0900000000001976a914631bcbe2e0de22e1b7f5e7464ba1667432c796e288ac00000000";
      // let block_height = 4995442;
      let block_size = 161;
      let block_hash = "85041572fdd397dc78a0a444300c6d978a41ad64841530675c54090eb330b4f6";
      let script_pubkey_hex = "10004c3972000001003fd0b1cd71d6a0ead1";
      console.log("testing the script pubkey hex ", script_pubkey_hex);

      // check the work
      let mcost = this._getMcostFromSize(block_size);
      mcost = 256;
      let data = this._getDataBytesFromTxAndHash(tx_unsigned_hex, block_hash);
      let limit_denary = this._getLimitDenary();
      let scriptPubkeyBytes = Buffer.from(script_pubkey_hex, 'hex');
      let work = Buffer.allocUnsafe(8);
      work.writeUint8(scriptPubkeyBytes[9], 0);
      work.writeUint8(scriptPubkeyBytes[10], 1);
      work.writeUint8(scriptPubkeyBytes[11], 2);
      work.writeUint8(scriptPubkeyBytes[12], 3);
      work.writeUint8(scriptPubkeyBytes[13], 4);
      work.writeUint8(scriptPubkeyBytes[14], 5);
      work.writeUint8(scriptPubkeyBytes[15], 6);
      work.writeUint8(scriptPubkeyBytes[16], 7);
      console.log('work hex', work.toString('hex'));
      let hash_denary = await this._getHashWithArgon2(data, work.toString('hex'), mcost);
      // let hash_hex = Buffer.from(hash_denary).toString('hex');
      let work_denary = work.readBigUInt64BE();
      console.log("hash denary is %s, limit denary is %s, work denary is %s", hash_denary, limit_denary, work_denary);
      return hash_denary;
  }
};


async function main() {
  console.log('calling FeelessJS.test_create_feework_and_script_pubkey');
  const result = await FeelessJS.test_create_feework_and_script_pubkey();
  console.log(result);
}

main();
