import useFeeEstimator from '@/composables/useFeeEstimator';
import CryptoService from '@/services/crypto';
import FeelessJS from '@/services/feeless';
import { useMainStore } from '@/store';
import * as bitcoinFeeless from '../../bitcoinjs-lib-feeless/src/index.js';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { floor } from 'mathjs';
import MathService from '@/services/math';
import * as Sentry from '@sentry/vue';

export default async function useTransactionBuilder(utxo, sendForm) {
  const mainStore = useMainStore();

  let fee = 0;
  if (!sendForm.isFeeless) {
    const feeEstimator = useFeeEstimator(utxo.length);
    fee = feeEstimator.fee;
  }

  console.log('TRANSACTION BUILDER: latest fee:', JSON.stringify(fee));

  function calculateChange(accountAmount, sendAmount) {
    let change = MathService.subtract(accountAmount, sendAmount);
    return change;
  }

  function findPathForAddress(address) {
    const path = sendForm.account.path;
    const { account: accountIndex } = CryptoService.breakAccountPath(path);
    // find address index on this particular account
    // iterate over account addresses until passed address is found and return its index
    for (let i = 0; i < Infinity; i++) {
      for (let j = 0; j <= 1; j++) {
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
      // let vout = txDetails.vout.find(
      //   (el) =>
      //     el.value === tx.amount &&
      //     el.scriptPubKey.addresses.includes(tx.address)
      // );
      let vout = txDetails.vout[tx.vout]; // nosemgrep detect-bracket-object-injection

      rawTransaction.addInput(
        txDetails.txid,
        vout.n, // same as tx.vout
        null,
        Buffer.from(vout.scriptPubKey.hex, 'hex')
      );
    }

    let recipient = {
      address: sendForm.address,
      amount: Number(
        MathService.multiply(MathService.subtract(sendForm.amount, fee), 1e6)
      ),
    };

    console.log(
      'TRANSACTION BUILDER: recipient will get:',
      Number(MathService.subtract(sendForm.amount, fee))
    );

    console.time('discoveraccount');
    let sumUtxo = utxo
      .map((el) => el.amount)
      .reduce((a, b) => MathService.add(a, b), 0);
    const { account } = CryptoService.breakAccountPath(sendForm.account.path);
    const nextAddressToUse = await CryptoService.addressDiscovery(account, 1);
    const next = CryptoService.breakAccountPath(nextAddressToUse);

    const child = CryptoService.getChildFromRoot(
      next.account,
      next.change,
      next.address
    );

    let change = {
      address: child.address,
      amount: Number(
        floor(
          MathService.multiply(
            calculateChange(sumUtxo, Number(sendForm.amount)),
            1e6
          )
        )
      ), // account amount - (send amount + fee)
    };
    console.timeEnd('discoveraccount');
    console.log('TRANSACTION BUILDER: change amount', change.amount);

    console.log('TRANSACTION BUILDER: change:', JSON.stringify(change));

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
        'TRANSACTION BUILDER: no change, its smaller than min change amount',
        calculateChange(sumUtxo, Number(sendForm.amount)),
        CryptoService.constraints.MINIMAL_CHANGE
      );
    }

    // create feework and feeless scriptPubkey and add output for feeless trx
    if (fee === 0) {
      console.time('FEELESS create_feework_and_script_pubkey');
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
        JSON.stringify(feelessScriptPubkey.toString('hex'))
      );

      rawTransaction.addOutput(Buffer.from(feelessScriptPubkey, 'hex'), 0);
      console.log(
        'TRANSACTION BUILDER: added output with zero amount and opcode OP_FEEWORK'
      );
    }

    console.time('TXTIME: findpath');
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

    console.timeEnd('TXTIME: findpath');

    console.log('Raw TX for decode: ');
    console.dir(rawTransaction);

    const rawTransactionToHex = rawTransaction.build().toHex();

    console.dir(rawTransactionToHex);

    let txid = '';
    try {
      txid = await mainStore.rpc('sendrawtransaction', [rawTransactionToHex]);
    } catch (e) {
      Sentry.captureMessage(
        'sendrawtransaction test:' + JSON.stringify(rawTransactionToHex)
      );
      console.error('Transaction builded, but rejected from RPC. Reason: ', e);
      throw e;
    }

    return txid;
  }

  const txid = await buildTransaction(utxo, sendForm);

  return {
    buildTransaction,
    txid,
  };
}
