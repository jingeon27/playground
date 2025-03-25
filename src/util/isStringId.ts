export function isStringId(param: { id: unknown }): param is { id: string } {
  return typeof param.id === "string";
}
export function isStringIds(...objs: { id: unknown }[]) {
  return objs.every(isStringId);
}
