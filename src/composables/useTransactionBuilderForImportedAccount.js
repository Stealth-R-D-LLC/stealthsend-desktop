import useFeeEstimator from '@/composables/useFeeEstimator';
import CryptoService from '@/services/crypto';
import FeelessJS from '@/services/feeless';
import { useMainStore } from '@/store';
import * as bitcoinFeeless from '../../bitcoinjs-lib-feeless/src/index.js';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { add, format, subtract, multiply } from 'mathjs';

export default async function useTransactionBuilder(utxo, sendForm) {
  const mainStore = useMainStore();

  let fee = 0;
  if (!sendForm.isFeeless) {
    const feeEstimator = useFeeEstimator(utxo.length);
    fee = feeEstimator.fee;
  }

  console.log('TRANSACTION BUILDER: latest fee:', fee);
  console.log('TRANSACTION BUILDER: unspent outputs:', utxo);

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

  const multiplyOf = (x = 0, y = 0) => {
    let result = multiply(x, y);
    result = format(result, { precision: 14 });
    return Number(result);
  };

  function calculateChange(accountAmount, sendAmount) {
    let change = subtractOf(accountAmount, sendAmount);
    return change;
  }
  async function buildTransaction() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
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
        let vout = txDetails.vout.find(
          (el) =>
            el.value === tx.amount &&
            el.scriptPubKey.addresses.includes(tx.address)
        );
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
      };

      let sumUtxo = utxo
        .map((el) => el.amount)
        .reduce((a, b) => sumOf(a, b), 0);
      let change = {
        address: sendForm.account.address,
        amount: multiplyOf(
          calculateChange(sumUtxo, Number(sendForm.amount)),
          1e6
        ), // account amount - (send amount + fee)
      };
      console.log('TRANSACTION BUILDER: sumUtxo: ', sumUtxo);
      console.log('TRANSACTION BUILDER: change: ', change);
      console.log(
        'TRANSACTION BUILDER: input amount: ',
        Number(sendForm.amount)
      );
      console.log(
        'TRANSACTION BUILDER: calc: ',
        calculateChange(sumUtxo, Number(sendForm.amount))
      );
      console.log(
        'TRANSACTION BUILDER: change min : ',
        CryptoService.constraints.MINIMAL_CHANGE
      );

      // add the output for recipient
      rawTransaction.addOutput(recipient.address, recipient.amount);

      // add the output for the change, send the change back to yourself.
      // Outputs - inputs = transaction fee, so always double-check your math!
      if (
        calculateChange(sumUtxo, Number(sendForm.amount)) >=
        CryptoService.constraints.MINIMAL_CHANGE
      ) {
        rawTransaction.addOutput(change.address, change.amount);
      } else {
        console.log(
          'TRANSACTION BUILDER: no change, its smaller than min change amount'
        );
      }

      // create feework and feeless scriptPubkey and add output for feeless trx
      if (fee === 0) {
        rawTransaction.setVersion(4);
        const bestBlock = await mainStore.rpc('getbestblock', []);

        const txUnsignedHex = rawTransaction.buildIncomplete().toHex();
        console.log(
          'FEELESS RAW TX: ',
          JSON.stringify(rawTransaction.__INPUTS.length)
        );
        console.log('FEELESS txUnsignedHex: ', JSON.stringify(txUnsignedHex));
        console.log('FEELESS height: ', JSON.stringify(bestBlock.height));
        console.log('FEELESS size: ', JSON.stringify(bestBlock.size));
        console.log('FEELESS hash: ', JSON.stringify(bestBlock.hash));
        console.time('FEELESS create_feework_and_script_pubkey');

        const feelessScriptPubkey =
          await FeelessJS.createFeeworkAndScriptPubkey(
            rawTransaction.__INPUTS.length,
            txUnsignedHex,
            bestBlock.height,
            bestBlock.size,
            bestBlock.hash
          );

        console.timeEnd('FEELESS create_feework_and_script_pubkey aa');

        console.log(
          'TRANSACTION BUILDER: feeless script sig key hex: ',
          JSON.stringify(feelessScriptPubkey.toString('hex'))
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
          JSON.stringify(testFeelessScriptPubkey)
        );
        rawTransaction.addOutput(Buffer.from(feelessScriptPubkey, 'hex'), 0);
        console.log(
          'TRANSACTION BUILDER: added output with zero amount and opcode OP_FEEWORK'
        );
      }

      const wallet = await CryptoService.getWalletFromDb();
      if (!wallet.password) {
        console.error('Invalid wallet');
        return;
      }

      const decryptedWIF = CryptoService.AESDecrypt(
        sendForm.account.wif,
        wallet.password
      );

      let keyPair = null;
      if (sendForm.isFeeless) {
        keyPair = bitcoinFeeless.ECPair.fromWIF(
          decryptedWIF,
          CryptoService.network
        );
      } else {
        keyPair = bitcoin.ECPair.fromWIF(decryptedWIF, CryptoService.network);
      }

      for (let i = 0; i < utxo.length; i++) {
        try {
          rawTransaction.sign(i, keyPair);
        } catch (e) {
          console.dir(e);
          throw new Error('TRANSACTION BUILDER: cannot sign tx: ', e);
        }
      }

      console.log('Raw TX for decode: ');
      console.dir(rawTransaction);
      const rawTransactionToHex = rawTransaction.build().toHex();
      console.dir(rawTransactionToHex);

      let txid = '';
      try {
        txid = await mainStore.rpc('sendrawtransaction', [rawTransactionToHex]);
      } catch (e) {
        console.error(
          'Transaction builded, but rejected from RPC. Reason: ',
          e
        );
      }

      resolve(txid);
      return txid;
    });
  }

  const txid = await buildTransaction(utxo, sendForm);
  return {
    buildTransaction,
    txid,
  };
}
