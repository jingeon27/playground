type GetReadonlyKeys<T> = {
  [K in keyof T]: T[K] extends Readonly<T[K]> ? K : never;
}[keyof T];
enum Comparison {
  Lower = -1,
  Equal = 0,
  Greater = 1,
}

type CompareNumbers<A extends number, B extends number> = A extends B
  ? Comparison.Equal
  : A extends 0
  ? B extends 0
    ? Comparison.Equal
    : B extends number
    ? Comparison.Lower
    : never
  : B extends 0
  ? A extends number
    ? Comparison.Greater
    : never
  : A extends number
  ? B extends number
    ? A extends B
      ? Comparison.Greater
      : Comparison.Lower
    : never
  : never;
type Compare = CompareNumbers<5, 0>;
