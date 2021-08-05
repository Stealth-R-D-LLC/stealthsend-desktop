import argon2 from 'argon2-browser';
import { XorShift1024Star } from 'xorshift.js';

export default function createFeeworkAndFeelessScriptPubkey(
  rawTransaction,
  bestBlock
) {
  function verifuint(value, max) {
    if (typeof value !== 'number')
      throw new Error('cannot write a non-number as a number');
    if (value < 0)
      throw new Error(
        'specified a negative value for writing an unsigned value'
      );
    if (value > max) throw new Error('RangeError: value out of range');
    if (Math.floor(value) !== value)
      throw new Error('value has a fractional component');
  }

  function writeUInt64BE(buffer, value, offset) {
    verifuint(value, 0xffffffffffffffff);
    buffer.writeInt32BE(value & -1, offset + 4);
    buffer.writeUInt32BE(Math.floor(value / 0x100000000), offset);
    return offset + 8;
  }

  function getMcostFromSize(size) {
    const M = 1000 * 110;
    const BASE = 256;
    let COST = (1 + size / 1000) * BASE;
    console.log('Starting COST: ', COST);
    let i = 2;
    while (i <= (31 * size) / 204800) {
      COST = parseFloat(parseFloat(COST * M) / 100000);
      i += 1;
    }
    const mcosts = [COST, 4608];
    const MCOST = Math.min(...mcosts);
    console.log('COST :', COST);
    console.log('MCOST:', MCOST);

    return MCOST;
  }

  // function getDataHexFromTxAndHash(hash){
  //   const txUnsignedHex = rawTransaction.buildIncomplete().toHex();
  //   const dataHex = hash + txUnsignedHex;
  //   console.log('DATA HEX: ', dataHex);
  //   return dataHex;
  // }

  function getDataBytesFromTxAndHash(hash) {
    const txUnsignedHex = rawTransaction.buildIncomplete().toHex();
    const HASH = Buffer.from(hash, 'hex');
    const TXBYTES = Buffer.from(txUnsignedHex, 'hex');
    const DATA = Buffer.concat([HASH, TXBYTES]);
    console.log('DATA BYTES: ', DATA);
    return DATA;
  }

  async function getWinningSalt(data, mcost) {
    console.log('crunching winning salt...');
    let OUTPUT = 0;
    let SALT = 0;
    // let outputCondition = 1970324836974591;
    let outputCondition = Buffer.allocUnsafe(8);
    writeUInt64BE(outputCondition, 1970324836974591, 0);
    let prng = new XorShift1024Star(Date.now().toString(16));
    do {
      SALT = prng.randomBytes(8);
      let output = await argon2.hash({
        pass: data,
        salt: SALT,
        time: 1,
        mem: mcost,
        hashLen: 8,
        parallelism: 1,
        type: argon2.ArgonType.Argon2d,
      });
      OUTPUT = parseInt(output.hashHex, 16);
      OUTPUT = Buffer.allocUnsafe(8);
      writeUInt64BE(OUTPUT, parseInt(output.hashHex, 16), 0);
    } while (OUTPUT > outputCondition);

    SALT = SALT.readUInt32BE(0);
    console.log('WINNING SALT   :', SALT);
    console.log('WINNING OUTPUT :', OUTPUT);
    return SALT;
  }

  async function createFeelessScriptPubkey() {
    let height = bestBlock.height;
    let size = parseInt(bestBlock.size, 10);
    let hash = bestBlock.hash;
    console.time('mcost');
    let MCOST = getMcostFromSize(size);
    console.timeEnd('mcost');
    // let DATA = getDataHexFromTxAndHash(hash);
    let DATA = getDataBytesFromTxAndHash(hash);
    console.time('salt');
    let SALT = await getWinningSalt(DATA, MCOST);
    console.timeEnd('salt');

    console.log('scriptpubkey');
    console.dir(bestBlock);
    console.log('HEIGHT :', height);
    console.log('SIZE   :', size);
    console.log('HASH   :', hash);
    console.log('MCOST  :', MCOST);
    console.log('DATA   :', DATA);
    console.log('SALT   :', SALT);

    const OP_FEEWORK = 209; // 0xd1
    const FEEWORK_SIZE = 18;
    const HEIGHT_OFFSET = 1;
    const MCOST_OFFSET = 5;
    const SALT_OFFSET = 9;
    const OPCODE_OFFSET = 17;
    let scriptPubkey = Buffer.allocUnsafe(FEEWORK_SIZE);
    scriptPubkey.writeUInt8(0x10, 0);
    console.log('1: ', scriptPubkey.toString('hex'));
    scriptPubkey.writeUInt32BE(height, HEIGHT_OFFSET);
    console.log('2: ', scriptPubkey.toString('hex'));
    scriptPubkey.writeUInt32BE(MCOST, MCOST_OFFSET);
    console.log('3: ', scriptPubkey.toString('hex'));
    writeUInt64BE(scriptPubkey, SALT, SALT_OFFSET);
    console.log('4: ', scriptPubkey.toString('hex'));
    scriptPubkey.writeUInt8(OP_FEEWORK, OPCODE_OFFSET);
    console.log('5: ', scriptPubkey.toString('hex'));
    return scriptPubkey;
  }

  return createFeelessScriptPubkey();
}
