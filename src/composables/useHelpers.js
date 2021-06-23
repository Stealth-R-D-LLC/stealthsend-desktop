import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { round } from 'mathjs';

export default function useHelpers() {
  // unix timestamp to 9:45:59 AM
  function formatBlocktime(blocktime, f = 'h:mm:ss a') {
    return format(fromUnixTime(blocktime), f);
  }

  // 2nd argument is usually for rounding fiat to 2 decimal places
  // without 2nd argument, the function will just add the decimal dots and comma separators
  function formatAmount(
    amount,
    roundDecimals = false,
    decimals = 2,
    minimumFractionDigits = 2
  ) {
    if (roundDecimals) {
      return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: minimumFractionDigits,
        maximumFractionDigits: 8
      }).format(amount, decimals);
    }
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: minimumFractionDigits,
    }).format(round(amount, decimals));
  }

  // used for grouping transactions by date
  // transform array of objects into object with grouped objects by chosen key
  const groupBy = (collection, iteratee = (x) => x) => {
    const it =
      typeof iteratee === 'function'
        ? iteratee
        : ({ [iteratee]: prop }) => prop;

    const array = Array.isArray(collection)
      ? collection
      : Object.values(collection);

    return array.reduce((r, e) => {
      const k = it(e);

      r[k] = r[k] || [];

      r[k].push(e);

      return r;
    }, {});
  };

  return {
    formatBlocktime,
    formatAmount,
    groupBy,
  };
}
