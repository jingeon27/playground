type CustomPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type CustomOmit<T, K extends keyof T> = CustomPick<T, Exclude<keyof T, K>>;

type CustomPatial<T> = {
  [P in keyof T]?: T[P];
};
