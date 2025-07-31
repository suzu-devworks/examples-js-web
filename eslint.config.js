import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import json from "@eslint/json"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
    rules: {
      "json/no-duplicate-keys": "error",
    },
  },
  {
    files: ["**/*.jsonc", "**/*.json"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
    rules: {
      "json/no-duplicate-keys": "error",
    },
  },
  {
    ignores: [
      // Tricks for breaking lines.
      ".*/**",
      "**/temp/**",
      "**/dist/**",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ["**/*.{cjs,cts}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
])
