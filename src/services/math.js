import { all, create } from 'mathjs';

const math = create(all, { 
  number: 'BigNumber',
  precision: 14
});

const MathService = {
    add(x,y) {
        console.log(`MATH add: ${x} + ${y} = ${math.add(x, y).toFixed(6)}`)
        return math.add(x, y).toFixed(6);
    },
    subtract(x,y) {
        console.log(`MATH subtract: ${x} - ${y} = ${math.subtract(x, y).toFixed(6)}`)
        return math.subtract(x, y).toFixed(6);
    },
    multiply(x, y) {
        console.log(`MATH multiply: ${x} x ${y} = ${math.multiply(x, y).toFixed(6)}`)
        return math.multiply(x, y).toFixed(6);
    }
};

export default MathService;