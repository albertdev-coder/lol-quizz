// eslint.config.js
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import nextRules from "eslint-config-next/core-web-vitals.js";

/** @type {import("eslint").FlatConfig[]} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: {
      "@typescript-eslint": typescriptPlugin,
      "unused-imports": unusedImportsPlugin,
    },

    rules: {
      // reglas generales
      semi: ["error", "always"],
      quotes: ["error", "double"],

      // reglas de imports
      "unused-imports/no-unused-imports": "error",

      // reglas TypeScript
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // reglas Next.js Core Web Vitals
      ...nextRules.rules,
    },

    ignores: ["node_modules/", ".next/", "out/"],
  },
];
