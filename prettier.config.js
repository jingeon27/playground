module.exports = {
  endOfLine: "auto",
  plugins: [require.resolve("@trivago/prettier-plugin-sort-imports")],
  importOrder: [
    "use client",
    "reflect-metadata",
    "<THIRD_PARTY_MODULES>",
    "^@(.*)$",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  printWidth: 110,
  importOrderCaseInsensitive: false,
  importOrderSortSpecifiers: true,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
};
