type Curry1<F extends (...args: any[]) => any> = ReturnType<F>;
type Curry2<F extends (...args: any[]) => any> = (
  ...args: Parameters<F>
) => Curry1<F>;

// type DynamicParamsCurrying<F extends (...args: any[]) => any> = {
//   0: Curry1<F>;
//   1: Curry2<F>;
// }[Parameters<F>["length"] extends 0 ? 0 : 1];

const add = (a: number, b: number, c: number) => a + b + c;
const DynamicParamsCurrying = (func: (...args: number[]) => number) => () => {};
// Test
const curried = DynamicParamsCurrying(add);
type CurriedFunction = (a: number) => CurriedFunction | number;
const asdf: CurriedFunction = (a) => (b) => {
  if (b === undefined) return a;
  return asdf(a + b);
};
