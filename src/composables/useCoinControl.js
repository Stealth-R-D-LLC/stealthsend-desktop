// import { ref, onMounted, watch } from 'vue'

// import { null } from "mathjs";

import CryptoService from '@/services/crypto';
import { add, format, subtract } from 'mathjs';

export default function useCoinControl(utxo, target) {
    let adjustedTarget = add(target, CryptoService.constraints.FEE)
    adjustedTarget = format(adjustedTarget, {precision: 14})

    const orderBy = (arr, props, orders) =>
    [...arr].sort((a, b) =>
      props.reduce((acc, prop, i) => {
        if (acc === 0) {
          const [p1, p2] =
            orders && orders[i] === 'desc' 
              ? [b[prop], a[prop]]
              : [a[prop], b[prop]];
          acc = p1 > p2 ? 1 : p1 < p2 ? -1 : 0;
        }
        return acc;
      }, 0)
    );


function exactMatch() {
    console.log('Start exact match', adjustedTarget, utxo);

    // pass through the UTXO pool and check if there is one that
    // has the exact same value as the adjusted target
    // If a UTXO exists that matches to the satoshi,
    // this UTXO will be returned as the candidate input set. No other selection
    // steps will be performed unless a new cycle is started
    let best = []
    for (let tx of utxo) {
        if (+tx.amount === +adjustedTarget) {
            best.push(tx)
            break;
        }
    }

    console.log('Start exact match return: ', best);
    return best
}

function sumOfSmaller() {
    console.log('Start sum of smaller');
    let sortedUtxo = orderBy(utxo, ['amount'], ['desc'])
    let minGreater = sortedUtxo[0].amount // initially is the largest
    console.log('mingreater: ', minGreater);
    
    // The UTXO pool is reduced to only the UTXOs that are smaller than (adjustedTarget + minimalChange). 
    // This subset will be referred to as smallerCoins henceforth. If the sum of smallerCoins matches adjustedTarget,
    // smallerCoins is returned as the candidate input set. No
    // other selection steps will be performed unless a new cycle is started.

    // The UTXO pool is reduced to only the UTXOs that are smaller than (adjustedTarget + minimalChange).
    let targetAndChange = add(adjustedTarget, CryptoService.constraints.MINIMAL_CHANGE)
    targetAndChange = format(targetAndChange, {precision: 14})

    let smallerCoins = sortedUtxo.filter(el => el.amount < targetAndChange)
    let bestSet = []

    //  If the sum of smallerCoins matches adjustedTarget, smallerCoins is returned as the candidate input set
    const sum = smallerCoins.map(el => el.amount).reduce((a, b) => a + b)

    if (sum < adjustedTarget) {
        for (let tx of sortedUtxo) {
            if (tx.amount > adjustedTarget && tx.amount < minGreater) {
                minGreater = tx.amount
                bestSet = tx
            } 
        }
    // Attempt to find an exact match by combining UTXOs from smallerCoins
    // Bitcoin Core runs the knapsack selection, trying to find an exact
    // match. If an exact match is discovered, this combination is returned as the
    // candidate input set. No other selection steps will be performed unless a new
    // cycle is started. Otherwise, no exact match was found and the algorithm will
    // fallback to creating a transaction with a change output.
    } else if (sum === adjustedTarget) {
        bestSet = [...smallerCoins]
    }

    console.log('Sum of smaller: ', bestSet);
    return bestSet
}

function knapsackSelection() {
    // Attempt to find an exact match by combining UTXOs from smallerCoins
    // Bitcoin Core runs the knapsack selection  trying to find an exact
    // match. If an exact match is discovered, this combination is returned as the
    // candidate input set. No other selection steps will be performed unless a new
    // cycle is started. Otherwise, no exact match was found and the algorithm will
    // fallback to creating a transaction with a change output.
    console.log('Start knapsack');
    // The UTXO pool is reduced to only the UTXOs that are smaller than (adjustedTarget + minimalChange).
    let targetAndChange = add(adjustedTarget, CryptoService.constraints.MINIMAL_CHANGE)
    targetAndChange = format(targetAndChange, {precision: 14})
    let sortedUtxo = orderBy(utxo, ['amount'], ['desc'])
    let smallerCoins = sortedUtxo.filter(el => el.amount < targetAndChange)

    let bestSet = null
    let bestSetValue = sortedUtxo[0].amount // largest
    let selectionSum = 0
    let targetReached = false
    let selectedUtxos = []

    const LIMIT = 1000

    console.log('input ', smallerCoins);

    for (let i = 1; i < LIMIT; i++) {
        if (!targetReached) {
            for (let j = 1; j < 2; j++) { // two tries?
                for(let tx of smallerCoins) {
                    if ((j === 2 && tx.isspent === 'false') || (j === 1 && Math.random() < 0.5)) {
                        selectionSum = add(selectionSum, tx.amount)
                        selectionSum = format(selectionSum, {precision: 14})
                        selectedUtxos.push(tx)
                        if (selectionSum === adjustedTarget) {
                            return selectedUtxos
                        }
                        if (selectionSum > adjustedTarget) {
                            targetReached = true
                            if (selectionSum < bestSetValue) {
                                bestSet = selectedUtxos
                                bestSetValue = selectionSum
                                // deselect last addition and try for better combinations
                                selectionSum = subtract(selectionSum, tx.amount)
                                selectionSum = format(selectionSum, {precision: 14})
                                selectedUtxos = selectedUtxos.filter(el => el.txid === tx.txid)
                            }
                        }
                    }
                }
    
            }
        }

    }
    console.log('End knapsack', bestSet);
    return bestSet
}


function coinSelection() {
    // Bitcoin Core’s current coin selection
    // consists of multiple steps and is focused on
    // finding an exact match. An exact match here refers to finding an
    // input set that is equal in value to the target. The benefit of an exact match is that it
    // avoids the creation of a change output. If Bitcoin Core cannot find an exact match
    // in several different attempts, it falls back to a knapsack solver which chooses an
    // input set that minimizes the change output to a base of 0.01 BTC.
    // Bitcoin Core tries three different ways of creating an exact match, 1. with a single
    // UTXO, 2. by combining all UTXOs smaller than the target10, and 3. by performing
    // a knapsack algorithm. Only then will it consider sets that would cause a change
    // output. Finally, it will pick the smaller out of the knapsack result or the minimal
    // larger UTXO.
    console.log('Coin selection start');
    console.log('TARGET: ', target);
    console.log('ADJUSTED TARGET: ', adjustedTarget);
    let bestSet = [...utxo]
    let result = null;

    result = exactMatch()
    if (result.length > 0) {
        bestSet = result
        return bestSet
    }

    result = sumOfSmaller()
    if (result.length > 0) {
        bestSet = result
        return bestSet
    }

    result = knapsackSelection()
    if (result.length > 0) {
        bestSet = result
        let coinControlSum = bestSet.map(el => el.amount).reduce((a, b) => a + b)
        if (coinControlSum > adjustedTarget) {
            result = knapsackSelection() // treba svim fjama rijesiti parametre a ne da gledaju u globalno
        }
        return bestSet
    }

    console.log('Coin selection end', result);
    console.log('Coin control sum', result.map(el => el.amount).reduce((a, b) => a + b)
    );
    return bestSet

}

coinSelection()

  return {
    coinSelection
  }
}