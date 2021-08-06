import argon2 from 'argon2-browser';
import { XorShift1024Star } from 'xorshift.js';
const readUInt64BE = require('readuint64be');
import { toBufferBE } from 'bigint-buffer';

export default function createFeeworkAndFeelessScriptPubkey(
  rawTransaction,
  bestBlock
) {
  async function createFeelessScriptPubkey() {
    let height = bestBlock.height;
    let size = parseInt(bestBlock.size, 10);
    let hash = bestBlock.hash;

    console.time('mcost');
    let MCOST = getMcostFromSize(size);
    console.timeEnd('mcost');
    let DATA = getDataBytesFromTxAndHash(hash);

    console.time('salt');
    let SALT = await getWinningSalt(DATA, MCOST);
    console.timeEnd('salt');

    console.log('HEIGHT :', height);
    console.log('SIZE   :', size);
    console.log('HASH   :', hash);
    console.log('MCOST  :', MCOST);
    console.log('DATA   :', DATA);
    console.log('SALT   :', SALT);

    return writeScriptPubkey(height, MCOST, SALT);
  }

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

  function readUInt64BE_2(buffer, offset) {
    const small = buffer.readUInt32BE(offset + 4);
    let big = buffer.readUInt32BE(offset);
    big *= 0x100000000;
    verifuint(big + small, 0xffffffffffffffff);
    return big + small;
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

  function getDataBytesFromTxAndHash(hash) {
    const txUnsignedHex = rawTransaction.buildIncomplete().toHex();
    const HASH = Buffer.from(hash, 'hex');
    const TXBYTES = Buffer.from(txUnsignedHex, 'hex');
    const DATA = Buffer.concat([HASH, TXBYTES]);
    console.log('DATA BYTES: ', DATA);
    return DATA;
  }

  async function getOutputWithArgon2(data, salt, mcost) {
    const output = await argon2.hash({
      pass: data,
      salt: salt,
      time: 1,
      mem: mcost,
      hashLen: 8,
      parallelism: 1,
      type: argon2.ArgonType.Argon2d,
    });
    return parseInt(output.hashHex, 16);
  }

  async function getWinningSalt(data, mcost) {
    console.log('crunching winning salt...');
    let OUTPUT = 0;
    let SALT;
    const outputCondition = 1970324836974591;
    do {
      try {
        const seedDate = Date.now();
        const seed = seedDate.toString(16);
        const prng = new XorShift1024Star(seed);
        SALT = prng.randomBytes(8);
        OUTPUT = await getOutputWithArgon2(data, SALT, mcost);
      } catch (e) {
        console.log(`Error in crunching the salt %s`, e.message);
        break;
      }
    } while (OUTPUT > outputCondition);

    console.log('SALT random bytes:', SALT);
    const SALT_hex = SALT.toString('hex');
    console.log('SALT hexadecimal', SALT_hex);
    console.log('SALT UInt64BE:', readUInt64BE(SALT));
    console.log('SALT UInt64BE_2:', readUInt64BE_2(SALT, 0));

    SALT = parseInt(SALT.toString('hex'), 16);
    console.log('WINNING SALT           :', SALT);
    const bn = BigInt.asUintN(64, BigInt(SALT));
    const bnHex = bnToHex(bn);
    console.log('WINNING SALT BufferBE  :', toBufferBE(bnHex, 8));
    console.log('WINNING SALT BigInt    :', bn);
    console.log('WINNING OUTPUT         :', OUTPUT);
    return bnHex;
  }

  function bnToHex(bn) {
    bn = BigInt(bn);

    var pos = true;
    if (bn < 0) {
      pos = false;
      bn = bitnot(bn);
    }

    var hex = bn.toString(16);
    if (hex.length % 2) {
      hex = '0' + hex;
    }

    if (pos && 0x80 & parseInt(hex.slice(0, 2), 16)) {
      hex = '00' + hex;
    }

    return hex;
  }

  function bitnot(bn) {
    bn = -bn;
    var bin = bn.toString(2);
    var prefix = '';
    while (bin.length % 8) {
      bin = '0' + bin;
    }
    if ('1' === bin[0] && -1 !== bin.slice(1).indexOf('1')) {
      prefix = '11111111';
    }
    bin = bin
      .split('')
      .map(function (i) {
        return '0' === i ? '1' : '0';
      })
      .join('');
    return BigInt('0b' + prefix + bin) + BigInt(1);
  }

  function writeScriptPubkey(height, mcost, salt) {
    const OP_FEEWORK = 209; // 0xd1 or 209
    const FEEWORK_SIZE = 18;
    const HEIGHT_OFFSET = 1;
    const MCOST_OFFSET = 5;
    const SALT_OFFSET = 9;
    const OPCODE_OFFSET = 17;

    const scriptPubkey = Buffer.allocUnsafe(FEEWORK_SIZE);

    scriptPubkey.writeUInt8(0x10, 0);
    scriptPubkey.writeUInt32BE(height, HEIGHT_OFFSET);
    scriptPubkey.writeUInt32BE(mcost, MCOST_OFFSET);
    scriptPubkey.fill(toBufferBE(salt, 8), SALT_OFFSET);
    scriptPubkey.writeUInt8(OP_FEEWORK, OPCODE_OFFSET);

    return scriptPubkey;
  }

  return createFeelessScriptPubkey();
}
