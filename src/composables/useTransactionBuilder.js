import CryptoService from '@/services/crypto';
import globalState from '@/store/global';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { add, format, subtract } from 'mathjs';

export default function useTransactionBuilder(utxo, sendForm) {
  console.log('start tx builder');

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
    let change = subtractOf(
      accountAmount,
      sumOf(sendAmount, CryptoService.constraints.FEE)
    );
    return change;
  }

  async function buildTransaction() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      let rawTransaction = new bitcoin.TransactionBuilder(
        CryptoService.network,
        3000000
      );

      // add all outputs
      for (let tx of utxo) {
        // get prevoutscript
        const txDetails = await globalState.rpc('gettransaction', [tx.txid]);

        rawTransaction.addInput(
          txDetails.txid,
          txDetails.vout[0].n,
          null,
          Buffer.from(txDetails.vout[0].scriptPubKey.hex, 'hex')
        );
      }

      let recipient = {
        address: sendForm.address,
        amount: Number(sendForm.amount) * 1e6,
      };

      let sumUtxo = utxo
        .map((el) => el.amount)
        .reduce((a, b) => sumOf(a, b), 0);
      let change = {
        address: sendForm.account.address,
        amount: calculateChange(sumUtxo, Number(sendForm.amount)) * 1e6, // account amount - (send amount + fee)
      };

      // add the output for recipient
      rawTransaction.addOutput(recipient.address, recipient.amount);

      // add the output for the change, send the change back to yourself.
      // Outputs - inputs = transaction fee, so always double-check your math!
      rawTransaction.addOutput(change.address, change.amount);

      // careful how to derive the path. depends on the account of the address
      // TODO account index?
      let { account: accountIndex } = CryptoService.breakAccountPath(
        sendForm.account.path
      );
      const child = CryptoService.master.derivePath(
        `m/44'/1'/${accountIndex}'/0/0`
      );

      const keyPair = bitcoin.ECPair.fromWIF(
        child.toWIF(),
        CryptoService.network
      );

      rawTransaction.sign(0, keyPair);

      console.dir(rawTransaction);

      const rawTransactionToHex = rawTransaction.build().toHex();
      console.log(rawTransactionToHex);

      const res = await globalState.rpc('sendrawtransaction', [
        rawTransactionToHex,
      ]);

      console.log('res', res);
      resolve();
    });
  }

  buildTransaction(utxo, sendForm);

  return {
    buildTransaction,
  };
}
