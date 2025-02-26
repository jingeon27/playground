import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", // Next.js 기본 규칙
    "next/typescript", // Next.js + TypeScript 지원
    "prettier", // Prettier와 충돌 방지
  ),
  {
    plugins: ["prettier"], // Prettier 플러그인 추가
    rules: {
      "prettier/prettier": ["error", { singleQuote: true, semi: true }], // Prettier 스타일 적용
      "react-hooks/exhaustive-deps": "off", // React Hooks 의존성 검사 비활성화
    },
  },
];

export default eslintConfig;
