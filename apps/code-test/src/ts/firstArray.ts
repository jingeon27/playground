type arr1 = ["a", "b", "c"];
type firstArray<T extends unknown[]> = T[0];
type sdf = firstArray<arr1>;
