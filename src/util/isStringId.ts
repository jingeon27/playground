export function isStringId(param: { id: unknown }): param is { id: string } {
  return typeof param.id === "string";
}
