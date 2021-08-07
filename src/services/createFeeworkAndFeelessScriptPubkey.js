import argon2 from 'argon2-browser';
import { XorShift1024Star } from 'xorshift.js';
import { Buffer } from 'buffer/index.js';

export default function createFeeworkAndFeelessScriptPubkey(
  rawTransaction,
  bestBlock
) {
  async function createFeelessScriptPubkey() {
    const HEIGHT = bestBlock.height;
    const SIZE = parseInt(bestBlock.size, 10);
    const BLOCKHASH = bestBlock.hash;

    console.time('mcost');
    const MCOST = _getMcostFromSize(SIZE);
    console.timeEnd('mcost');

    const DATA = _getDataBytesFromTxAndHash(BLOCKHASH);

    console.time('salt');
    const SALT = await _getWinningSalt(DATA, MCOST);
    console.timeEnd('salt');

    console.log('HEIGHT     :', HEIGHT);
    console.log('SIZE       :', SIZE);
    console.log('BLOCKHASH  :', BLOCKHASH);
    console.log('MCOST      :', MCOST);
    console.log('DATA       :', DATA);
    console.log('SALT       :', SALT);

    return _writeScriptPubkey(HEIGHT, MCOST, SALT);
  }

  function _getMcostFromSize(size) {
    const M = 1000 * 110;
    const BASE = 256;
    let COST = (1 + size / 1000) * BASE;
    console.log('SIZE: ', size);
    console.log('Starting COST: ', COST);
    let i = 2;
    while (i <= (31 * size) / 204800) {
      COST = parseFloat(parseFloat(COST * M) / 100000);
      i += 1;
    }
    const mcosts = [COST, 4608];
    const MCOST = Number(Math.ceil(Math.min(...mcosts)));
    console.log('COST :', COST);
    console.log('MCOST:', MCOST);
    return MCOST;
  }

  function _getDataBytesFromTxAndHash(hash) {
    const txUnsignedHex = rawTransaction.buildIncomplete().toHex();
    const HASH = Buffer.from(hash, 'hex');
    const TXBYTES = Buffer.from(txUnsignedHex, 'hex');
    const DATA = Buffer.concat([HASH, TXBYTES]);
    console.log('DATA BYTES: ', DATA);
    return DATA;
  }

  async function _getWinningSalt(data, mcost) {
    console.log('crunching winning salt...');
    let OUTPUT;
    let SALT;
    const outputCondition = _hexToBn('0006ffffffffffff');
    do {
      try {
        const seedDate = Date.now();
        const seed = seedDate.toString(16);
        const prng = new XorShift1024Star(seed);
        SALT = prng.randomBytes(8);
        OUTPUT = await _getOutputWithArgon2(data, SALT, mcost);
      } catch (e) {
        console.log(`Error in crunching the salt`, e);
        throw new Error(e);
      }
    } while (OUTPUT > outputCondition);

    console.log('WINNING SALT hex :', SALT.toString('hex'));
    SALT = _hexToBn(SALT.toString('hex'));
    console.log('WINNING SALT     :', SALT);
    console.log('WINNING OUTPUT   :', OUTPUT);
    return SALT;
  }

  async function _getOutputWithArgon2(data, salt, mcost) {
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
    return _hexToBn(output);
  }

  function _writeScriptPubkey(height, mcost, salt) {
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
  }

  function _hexToBn(hex) {
    if (hex.length % 2) {
      hex = '0' + hex;
    }
    return BigInt('0x' + hex);
  }

  return createFeelessScriptPubkey();
}
