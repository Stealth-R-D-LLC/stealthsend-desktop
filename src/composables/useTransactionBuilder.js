import useFeeEstimator from '@/composables/useFeeEstimator';
import CryptoService from '@/services/crypto';
import FeelessJS from '@/services/feeless';
import { useMainStore } from '@/store';
import * as bitcoinFeeless from '../../bitcoinjs-lib-feeless/src/index.js';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { add, format, subtract, floor } from 'mathjs';

export default async function useTransactionBuilder(utxo, sendForm) {
  const mainStore = useMainStore();

  let fee = 0;
  if (!sendForm.isFeeless) {
    const feeEstimator = useFeeEstimator(utxo.length);
    fee = feeEstimator.fee;
  }

  console.log('TRANSACTION BUILDER: latest fee:', fee);

  const sumOf = (x = 0, y = 0) => {
    let sum = add(x, y);
    sum = format(sum, { precision: 14 });
    return Number(sum);
  };

  const subtractOf = (x = 0, y = 0) => {
    let diff = subtract(x, y);
    diff = format(diff, { precision: 14 });
    return Number(diff);
  };
  function calculateChange(accountAmount, sendAmount) {
    let change = subtractOf(accountAmount, sendAmount);
    return change;
  }

  function findPathForAddress(address) {
    const path = sendForm.account.path;
    const { account: accountIndex } = CryptoService.breakAccountPath(path);
    // find address index on this particular account
    // iterate over account addresses until passed address is found and return its index
    for (let i = 0; i < Infinity; i++) {
      for (let j = 0; j <= 1; j++) {
        // similar logic like in accountDiscovery
        const acc = CryptoService.getChildFromRoot(accountIndex, j, i);
        if (acc.address === address) {
          let path = CryptoService.breakAccountPath(
            `${accountIndex}'/${j}/${i}`
          );
          return path;
        }
      }
    }
  }

  async function buildTransaction() {
    // eslint-disable-next-line no-async-promise-executor
    let rawTransaction = null;
    if (sendForm.isFeeless) {
      rawTransaction = new bitcoinFeeless.TransactionBuilder(
        CryptoService.network,
        3000000
      );
    } else {
      rawTransaction = new bitcoin.TransactionBuilder(
        CryptoService.network,
        3000000
      );
    }

    // add all outputs
    for await (let tx of utxo) {
      // get prevoutscript
      const txDetails = await mainStore.rpc('gettransaction', [tx.txid]);
      let vout = txDetails.vout.find((el) => el.scriptPubKey.addresses.includes(tx.address));

      rawTransaction.addInput(
        txDetails.txid,
        vout.n,
        null,
        Buffer.from(vout.scriptPubKey.hex, 'hex')
      );
    }

    let recipient = {
      address: sendForm.address,
      amount: Number(sumOf(sendForm.amount, fee * -1)) * 1e6,
      // amount: multiply(bignumber(sendForm.amount), bignumber(-Math.abs(0.01)), 1e6).d[0]
    };

    console.log(
      'TRANSACTION BUILDER: recipient will get:',
      Number(sumOf(sendForm.amount, fee * -1))
    );

    let sumUtxo = utxo.map((el) => el.amount).reduce((a, b) => sumOf(a, b), 0);
    const { account } = CryptoService.breakAccountPath(sendForm.account.path);
    const discoveredAddresses = await CryptoService.accountDiscovery(
      account,
      1
    );
    let nextFreeAddress = CryptoService.nextToUse(
      discoveredAddresses.freeAddresses
    );
    const next = CryptoService.breakAccountPath(nextFreeAddress);

    const child = CryptoService.getChildFromRoot(
      next.account,
      next.change,
      next.address
    );

    let change = {
      address: child.address,
      amount: floor(calculateChange(sumUtxo, Number(sendForm.amount)) * 1e6), // account amount - (send amount + fee)
    };
    console.log(
      'TRANSACTION BUILDER: change:',
      floor(calculateChange(sumUtxo, Number(sendForm.amount)) * 1e6)
    );

    // add the output for recipient
    rawTransaction.addOutput(recipient.address, recipient.amount);

    // add the output for the change, send the change back to yourself.
    // Outputs - inputs = transaction fee, so always double-check your math!
    if (change.amount > 0) {
      rawTransaction.addOutput(change.address, change.amount);
    }

    // create feework and feeless scriptPubkey and add output for feeless trx
    if (fee === 0) {
      rawTransaction.setVersion(4);
      const bestBlock = await mainStore.rpc('getbestblock', []);

      const txUnsignedHex = rawTransaction.buildIncomplete().toHex();
      console.log('FEELESS RAW TX: ', rawTransaction.__INPUTS.length);
      console.log('FEELESS txUnsignedHex: ', txUnsignedHex);
      console.log('FEELESS height: ', bestBlock.height);
      console.log('FEELESS size: ', bestBlock.size);
      console.log('FEELESS hash: ', bestBlock.hash);
      console.time('FEELESS create_feework_and_script_pubkey');

      const feelessScriptPubkey = await FeelessJS.createFeeworkAndScriptPubkey(
        rawTransaction.__INPUTS.length,
        txUnsignedHex,
        bestBlock.height,
        bestBlock.size,
        bestBlock.hash
      );

      console.timeEnd('FEELESS create_feework_and_script_pubkey');

      console.log(
        'TRANSACTION BUILDER: feeless script sig key hex: ',
        feelessScriptPubkey.toString('hex')
      );
      const testFeelessScriptPubkey =
        await FeelessJS.testCreateFeeworkAndScriptPubkey(
          txUnsignedHex,
          bestBlock.height,
          bestBlock.size,
          bestBlock.hash,
          feelessScriptPubkey.toString('hex')
        );
      console.log(
        'FEELESS test results for script pubkey: ',
        testFeelessScriptPubkey
      );
      rawTransaction.addOutput(Buffer.from(feelessScriptPubkey, 'hex'), 0);
      console.log(
        'TRANSACTION BUILDER: added output with zero amount and opcode OP_FEEWORK'
      );
    }

    for (let i = 0; i < utxo.length; i++) {
      // careful how to derive the path. depends on the account of the address
      const pathForAddress = findPathForAddress(utxo[i].address);
      const child = CryptoService.master.derivePath(
        `m/44'/${process.env.VUE_APP_NETWORK === 'mainnet' ? 125 : 1}'/${
          pathForAddress.account
        }'/${pathForAddress.change}/${pathForAddress.address}` // TODO CHANGE 1 (TESTNET) TO 125 (XST)
      );

      let keyPair = null;
      if (sendForm.isFeeless) {
        keyPair = bitcoinFeeless.ECPair.fromWIF(
          child.toWIF(),
          CryptoService.network
        );
      } else {
        keyPair = bitcoin.ECPair.fromWIF(child.toWIF(), CryptoService.network);
      }

      try {
        rawTransaction.sign(i, keyPair);
      } catch (e) {
        console.dir(e);
        throw new Error('TRANSACTION BUILDER: cannot sign tx: ', e);
      }
    }

    console.dir(rawTransaction);

    const rawTransactionToHex = rawTransaction.build().toHex();

    console.dir(rawTransactionToHex);

    const txid = await mainStore.rpc('sendrawtransaction', [
      rawTransactionToHex,
    ]);

    return txid;
  }

  const txid = await buildTransaction(utxo, sendForm);

  return {
    buildTransaction,
    txid,
  };
}
