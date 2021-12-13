import { all, create } from 'mathjs';

const math = create(all, {
  number: 'BigNumber',
  precision: 14,
});

const MathService = {
  add(x, y) {
    return Number(math.add(x, y).toFixed(6));
  },
  subtract(x, y) {
    return Number(math.subtract(x, y).toFixed(6));
  },
  multiply(x, y) {
    return Number(math.multiply(x, y).toFixed(6));
  },
};

export default MathService;
