import CryptoService from '@/services/crypto';
import globalState from '@/store/global';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { add, format, subtract } from 'mathjs';


export default function useTransactionBuilder(utxo, sendForm) {
    console.log('start tx builder');

    function calculateChange(accountAmount, sendAmount) {
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
  
        let change = subtractOf(
          accountAmount,
          sumOf(sendAmount, CryptoService.constraints.FEE)
        );
        console.log('acc amount ', accountAmount);
        console.log('send am', sendAmount);
        console.log('chage', change);
        return change;
      }

    async function buildTransaction() {


    let rawTransaction = new bitcoin.TransactionBuilder(
        CryptoService.network,
        3000000
      );

      // add all outputs
      for (let tx of utxo) {
        // get prevoutscript
        const txDetails = await globalState.rpc('gettransaction', [tx.txid]);
        console.log('tx details: ', txDetails);
        console.log('tx prevOutScript: ', txDetails.vout[0].scriptPubKey.hex);

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
      let change = {
        address: sendForm.account.address,
        amount: calculateChange(0.99, Number(sendForm.amount)) * 1e6, // account amount - (send amount + fee)
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
      console.log('wif', child.toWIF());

      rawTransaction.sign(0, keyPair);

      // console.dir('rawtrx', rawTransaction);
      return rawTransaction.build().toHex();
    }

    buildTransaction(utxo)

  return {
    buildTransaction
  }
}