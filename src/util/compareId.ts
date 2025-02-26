type returnParamType<T extends Object> = { id: number | string } & {
  [key in keyof T]: T[key];
};

/**
 * @example 오브젝트.findIndex(compareIndex(비교값))
 * @param compareValue 객체의 id와 비교하는 값
 * @param isSame compareValue와 오브젝트 안의 값이 참인지 거짓인지 비교
 * @returns
 */
export function compareId(compareValue?: number | string, isSame = true) {
  return <T extends Object>({ id }: returnParamType<T>) =>
    isSame
      ? String(compareValue) === String(id)
      : String(compareValue) !== String(id);
}
