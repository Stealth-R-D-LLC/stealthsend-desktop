import { add, format, subtract } from 'mathjs';
import CryptoService from '@/services/crypto';

export default function useCoinControl(outputs, target) {
  console.log(
    'COIN CONTROL candidates',
    JSON.stringify(outputs),
    JSON.stringify(target)
  );
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

  const sumOf = (x = 0, y = 0) => {
    let sum = add(x, y);
    sum = format(sum, { precision: 14 });
    return Number(sum);
  };

  const removeFromArray = (arr, predicate) => {
    var complement = function (f) {
      return function (x) {
        return !f(x);
      };
    };
    return arr.filter(complement(predicate));
  };

  function getMinSingle(utxo, target) {
    // get min(u ∈ U; u > t + mc)
    if (utxo.length === 0) return [];
    let filteredUtxo = utxo.filter((el) => el.amount > target);
    filteredUtxo = orderBy(filteredUtxo, ['amount'], ['asc']);
    return filteredUtxo.length > 0 ? filteredUtxo[0] : [];
  }
  function exactMatch(utxo, adjustedTarget) {
    // pass through the UTXO pool and check if there is one that
    // has the exact same value as the adjusted target
    // If a UTXO exists that matches to the satoshi,
    // this UTXO will be returned as the candidate input set. No other selection
    // steps will be performed unless a new cycle is started
    let best = [];
    for (let tx of utxo) {
      if (tx.amount === adjustedTarget) {
        best.push(tx);
        break;
      }
    }

    return best;
  }

  function sumOfSmaller(utxo, adjustedTarget) {
    let sortedUtxo = orderBy(utxo, ['amount'], ['desc']);

    // The UTXO pool is reduced to only the UTXOs that are smaller than (adjustedTarget + minimalChange).
    // This subset will be referred to as smallerCoins henceforth. If the sum of smallerCoins matches adjustedTarget,
    // smallerCoins is returned as the candidate input set.
    //  No other selection steps will be performed unless a new cycle is started.

    let smallerCoins = sortedUtxo.filter((el) => el.amount < adjustedTarget);
    let bestSet = [];

    //  If the sum of smallerCoins matches adjustedTarget, smallerCoins is returned as the candidate input set
    const sum = smallerCoins.map((el) => el.amount).reduce((a, b) => a + b, 0);

    if (sum < adjustedTarget) {
      let minGreater = sortedUtxo[0].amount; // initially is the largest
      for (let tx of sortedUtxo) {
        if (tx.amount > adjustedTarget && tx.amount < minGreater) {
          minGreater = tx.amount;
          bestSet = { ...tx };
        }
      }
      // Attempt to find an exact match by combining UTXOs from smallerCoins
      // Bitcoin Core runs the knapsack selection, trying to find an exact
      // match. If an exact match is discovered, this combination is returned as the
      // candidate input set. No other selection steps will be performed unless a new
      // cycle is started. Otherwise, no exact match was found and the algorithm will
      // fallback to creating a transaction with a change output.
    } else if (sum === adjustedTarget) {
      bestSet = [...smallerCoins];
    }

    return bestSet;
  }

  function subsetSum(utxo, adjustedTarget) {
    // attempt to find a subset of items which sum of amounts is larger than the target amount

    // the complexity of the subsetSum algo is too big
    // simply skip this algo for "big" pools of data
    if (utxo.length > 10) return [];

    // if there are multiple subsets, the one with the closest sum to the target amount will be used
    let sortedUtxo = orderBy(utxo, ['amount'], ['desc']);
    var result = [];
    const findSubset = (sortedUtxo, target, partial = [], sum = 0) => {
      if (sum < target) {
        sortedUtxo.forEach((tx, i) => {
          let a = partial.concat([tx]);
          findSubset(sortedUtxo.slice(i + 1), target, a, sumOf(sum, tx.amount));
        });
      } else if (sum >= target) {
        result.push(partial);
      }
    };
    findSubset(sortedUtxo, adjustedTarget);

    if (result.length === 0) return [];

    // obtain smallest array (result) from array of arrays
    let sortedRes = orderBy(result, ['amount'], ['desc']);
    return sortedRes[sortedRes.length - 1];
  }

  function knapsackSelection(utxo, adjustedTarget) {
    // Attempt to find an exact match by combining UTXOs from smallerCoins
    // Bitcoin Core runs the knapsack selection  trying to find an exact
    // match. If an exact match is discovered, this combination is returned as the
    // candidate input set. No other selection steps will be performed unless a new
    // cycle is started. Otherwise, no exact match was found and the algorithm will
    // fallback to creating a transaction with a change output.

    // actual input of utxos, smaller coins sorted desc
    let sortedUtxo = orderBy(utxo, ['amount'], ['desc']);
    let smallerCoins = sortedUtxo.filter((el) => el.amount < adjustedTarget);

    let bestSet = [];
    let bestSetValue = sortedUtxo[0].amount; // largest
    let selectionSum = 0;
    let targetReached = false;
    let selectedUtxos = [];

    const LIMIT = 1000;

    for (let i = 1; i <= LIMIT; i++) {
      if (!targetReached) {
        for (let j = 1; j <= 2; j++) {
          // two tries?f
          for (let tx of smallerCoins) {
            if (
              (j === 2 && !selectedUtxos.some((el) => el.txid === tx.txid)) ||
              (j === 1 && Math.random() < 0.5)
            ) {
              if (!selectedUtxos.some((el) => el.txid === tx.txid)) {
                selectionSum = sumOf(selectionSum, tx.amount);
                selectedUtxos.push(tx);
                if (selectionSum === adjustedTarget) {
                  return selectedUtxos;
                }
                if (selectionSum > adjustedTarget) {
                  targetReached = true;
                  if (selectionSum <= bestSetValue) {
                    bestSet = [...selectedUtxos];
                    bestSetValue = selectionSum;
                    // deselect last addition and try for better combinations
                    selectionSum = subtract(selectionSum, tx.amount);
                    selectionSum = Number(
                      format(selectionSum, { precision: 14 })
                    );
                    selectedUtxos = removeFromArray(
                      selectedUtxos,
                      (el) => el.txid === tx.txid
                    );
                  }
                }
              }
            }
          }
        }
      }
    }
    return bestSet;
  }

  function iterateUntilTargetMet(utxo, adjustedTarget) {
    // iterate over all utxos until the target is met
    // this should be the last line of defence

    // sort the utxos descending in order to spend small amounts
    let sortedUtxo = orderBy(utxo, ['amount'], ['asc']);

    let sum = 0;
    let result = [];
    for (let candidate of sortedUtxo) {
      if (sum < adjustedTarget) {
        if (candidate.amount >= CryptoService.constraints.MINIMAL_CHANGE) {
          sum = sumOf(sum, candidate.amount);
          result.push(candidate);
        }
      }
    }
    return result;
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

    let adjustedTarget = sumOf(target, 0); // no need to add fee here because we are already increasing the target amount before sending it to coinControl

    // let bestSet = [...outputs]; // fallback
    let bestSet = iterateUntilTargetMet(outputs, adjustedTarget);
    console.log('best: ', bestSet);
    let result = null;

    result = exactMatch(outputs, adjustedTarget);
    console.info('COIN CONTROL: exactMatch() ', JSON.stringify(result));
    if (result.length > 0) {
      bestSet = [...result];
      return bestSet;
    }

    result = sumOfSmaller(outputs, adjustedTarget);
    console.info('COIN CONTROL: sumOfSmaller() ', JSON.stringify(result));
    if (result.length > 0) {
      bestSet = [...result];
      return bestSet;
    }

    result = subsetSum(outputs, adjustedTarget);
    console.info('COIN CONTROL: subsetSum() ', JSON.stringify(result));
    if (result.length > 0) {
      bestSet = [...result];
      return bestSet;
    }

    result = knapsackSelection(outputs, target);
    console.info('COIN CONTROL: knapsackSelection() ', JSON.stringify(result));
    if (result.length > 0) {
      bestSet = [...result];
      // let coinControlSum = bestSet
      //   .map((el) => el.amount)
      //   .reduce((a, b) => a + b, 0);
      // if (coinControlSum > adjustedTarget) {
      //   bestSet = knapsackSelection(outputs, target); // treba svim fjama rijesiti parametre a ne da gledaju u globalno
      // }
      return bestSet;
    }

    let minSingleUtxo = getMinSingle(outputs, target);
    console.info(
      'COIN CONTROL: getMinSingle() ',
      JSON.stringify(minSingleUtxo)
    );

    if (
      minSingleUtxo &&
      minSingleUtxo.amount <
        bestSet.map((el) => el.amount).reduce((a, b) => a + b, 0)
    ) {
      bestSet = [minSingleUtxo];
      return bestSet;
    } else {
      return bestSet;
    }
  }

  let best = coinSelection(); // run coin selection on init
  console.log('COIN CONTROL RESULT: ', best);

  return {
    best,
  };
}
