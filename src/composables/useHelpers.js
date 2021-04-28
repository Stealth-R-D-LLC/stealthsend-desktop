import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { round } from 'mathjs';

export default function useHelpers() {
  // unix timestamp to 9:45:59 AM
  function formatBlocktime(blocktime) {
    return format(fromUnixTime(blocktime), 'h:mm:s a');
  }

  // 2nd argument is usually for rounding fiat to 2 decimal places
  // without 2nd argument, the function will just add the decimal dots and comma separators
  function formatAmount(amount, roundDecimals = false) {
    if (roundDecimals) {
      return new Intl.NumberFormat('en-IN').format(amount);
    }
    return new Intl.NumberFormat('en-IN').format(round(amount, 2));
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
