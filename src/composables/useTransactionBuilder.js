import useFeeEstimator from '@/composables/useFeeEstimator';
import CryptoService from '@/services/crypto';
import { useMainStore } from '@/store';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { add, subtract, multiply, round } from 'mathjs';

export default async function useTransactionBuilder(utxo, sendForm) {
  const mainStore = useMainStore();

  const { fee } = useFeeEstimator(utxo.length);

  console.log('TRANSACTION BUILDER: latest fee:', fee);

  const sumOf = (x = 0, y = 0) => {
    let sum = round(add(x, y), 8);
    // sum = format(sum, { precision: 8 });
    return sum;
  };

  const subtractOf = (x = 0, y = 0) => {
    let diff = round(subtract(x, y), 8);
    // diff = format(diff, { precision: 8 });
    return diff;
  };

  const multiplyOf = (x = 0, y = 0) => {
    let result = round(multiply(x, y), 8);
    // result = format(result, { precision: 8 });
    return result;
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
      // similar logic like in accountDiscovery
      const acc = CryptoService.getChildFromRoot(accountIndex, 0, i);
      console.log('TRANSACTION BUILDER: checking addr');
      if (acc.address === address) {
        let { address } = CryptoService.breakAccountPath(
          `${accountIndex}'/0/${i}`
        );
        return address;
      }
    }
  }

  async function buildTransaction() {
    // eslint-disable-next-line no-async-promise-executor
    let rawTransaction = new bitcoin.TransactionBuilder(
      CryptoService.network,
      3000000
    );

    // add all outputs
    for await (let tx of utxo) {
      // get prevoutscript
      const txDetails = await mainStore.rpc('gettransaction', [tx.txid]);

      let vout = txDetails.vout.find((el) => el.value === tx.amount);

      rawTransaction.addInput(
        txDetails.txid,
        vout.n,
        null,
        Buffer.from(vout.scriptPubKey.hex, 'hex')
      );
    }

    let recipient = {
      address: sendForm.address,
      amount: multiplyOf(
        Number(sumOf(sendForm.amount, multiplyOf(fee, -1))),
        1e6
      ),
      // amount: multiply(bignumber(sendForm.amount), bignumber(-Math.abs(0.01)), 1e6).d[0]
    };

    console.log(
      'TRANSACTION BUILDER: recipient will get:',
      multiplyOf(Number(sumOf(sendForm.amount, multiplyOf(fee, -1))), 1e6)
    );

    let sumUtxo = utxo.map((el) => el.amount).reduce((a, b) => sumOf(a, b), 0);
    let change = {
      address: sendForm.account.address,
      amount: multiplyOf(
        calculateChange(sumUtxo, Number(sendForm.amount)),
        1e6
      ), // account amount - (send amount + fee)
    };
    console.log(
      'TRANSACTION BUILDER: change:',
      calculateChange(sumUtxo, Number(sendForm.amount))
    );

    // add the output for recipient
    rawTransaction.addOutput(recipient.address, recipient.amount);

    // add the output for the change, send the change back to yourself.
    // Outputs - inputs = transaction fee, so always double-check your math!
    if (change.amount > 0) {
      rawTransaction.addOutput(change.address, change.amount);
    }

    let { account: accountIndex } = CryptoService.breakAccountPath(
      sendForm.account.path
    );

    for (let i = 0; i < utxo.length; i++) {
      // careful how to derive the path. depends on the account of the address
      const child = CryptoService.master.derivePath(
        `m/44'/${
          process.env.VUE_APP_NETWORK === 'mainnet' ? 125 : 1
        }'/${accountIndex}'/0/${findPathForAddress(utxo[i].address)}` // TODO CHANGE 1 (TESTNET) TO 125 (XST)
      );

      const keyPair = bitcoin.ECPair.fromWIF(
        child.toWIF(),
        CryptoService.network
      );

      try {
        rawTransaction.sign(i, keyPair);
      } catch (e) {
        throw new Error('TRANSACTION BUILDER: cannot sign tx: ', e);
      }
    }

    console.dir(rawTransaction);

    const rawTransactionToHex = rawTransaction.build().toHex();

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
