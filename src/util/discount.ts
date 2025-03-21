export type Discount = (price: number) => number;

export const percentageDiscount = (percent: number) => (price: number) =>
  price - price * (percent / 100);

export const fixedDiscount = (amount: number) => (price: number) =>
  Math.max(price - amount, 0);

export const buyOneGetOneFree = (count: number) => (price: number) =>
  count >= 2 ? price / 2 : price;

export const applyDiscounts = (discounts: Discount[]) => (price: number) =>
  discounts.reduce((acc, discount) => discount(acc), price);
