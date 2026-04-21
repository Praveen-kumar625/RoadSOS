import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "error",
      "no-console": ["warn", { allow: ["error", "warn", "info"] }],
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
    },
  },
];