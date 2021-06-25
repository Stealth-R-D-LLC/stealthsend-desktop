import useFeeEstimator from '@/composables/useFeeEstimator';
import CryptoService from '@/services/crypto';
import { useMainStore } from '@/store';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { add, format, subtract } from 'mathjs';

export default async function useTransactionBuilder(utxo, sendForm) {
  console.log('UTXOs: ', utxo);
  const mainStore = useMainStore();

  const { fee } = useFeeEstimator(utxo.length);

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
    let change = subtractOf(accountAmount, sumOf(sendAmount, fee));
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
      for await (let tx of utxo) {
        // get prevoutscript
        const txDetails = await mainStore.rpc('gettransaction', [tx.txid]);

        let vout = txDetails.vout.find((el) => el.value === tx.amount);

        console.log('adding input: ', {
          txid: txDetails.txid,
          vout: vout.n,
          pubkey: Buffer.from(vout.scriptPubKey.hex, 'hex'),
        });

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
        amount: calculateChange(sumUtxo, Number(sendForm.amount)) * 1e6, // account amount - (send amount + fee)
      };

      // add the output for recipient
      rawTransaction.addOutput(recipient.address, recipient.amount);
      console.log('output 1: ', recipient.address, recipient.amount);

      // add the output for the change, send the change back to yourself.
      // Outputs - inputs = transaction fee, so always double-check your math!
      if (change.amount > 0) {
        console.log('output 2: ', change.address, change.amount);
        rawTransaction.addOutput(change.address, change.amount);
      }

      // careful how to derive the path. depends on the account of the address
      let { account: accountIndex } = CryptoService.breakAccountPath(
        sendForm.account.path
      );
      console.log('account for signing: ', sendForm.account, accountIndex);
      console.log('jebemti', CryptoService.getChildFromRoot(accountIndex, 0, 0));
      const child = CryptoService.master.derivePath(
        `m/44'/${
          process.env.VUE_APP_NETWORK === 'mainnet' ? 125 : 1
        }'/${accountIndex}'/0/0` // TODO CHANGE 1 (TESTNET) TO 125 (XST)
      );

      console.log('wif: ', child.toWIF());

      const keyPair = bitcoin.ECPair.fromWIF(
        child.toWIF(),
        CryptoService.network
      );

      // console.log('keypair', keyPair);

      for (let i = 0; i < utxo.length; i++) {
        try {
          rawTransaction.sign(i, keyPair);
        } catch (e) {
          console.log('cannot sign tx', e);
        }
      }

      console.dir(rawTransaction);

      const rawTransactionToHex = rawTransaction.build().toHex();

      const res = await mainStore.rpc('sendrawtransaction', [
        rawTransactionToHex,
      ]);

      console.log('res', res);
      resolve(res);
    });
  }

  const txid = await buildTransaction(utxo, sendForm);

  return {
    buildTransaction,
    txid,
  };
}
