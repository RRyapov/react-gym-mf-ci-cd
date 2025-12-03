const path = require("node:path");

const project = path.resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: { browser: true, es2021: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    project,
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project,
      },
    },
  },
  extends: [
    "plugin:import/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["prefer-arrow-functions", "react-refresh"],
  rules: {
    "react-refresh/only-export-components": "error",
    "prefer-arrow-functions/prefer-arrow-functions": [
      "error",
      {
        returnStyle: "implicit",
      },
    ],
    "object-shorthand": "error",
    "no-alert": "error",
    "no-console": "warn",
    curly: ["error", "all"],
    "arrow-body-style": ["error", "as-needed"],
    "no-implicit-coercion": "error",
    "prefer-template": "error",
    "import/no-unresolved": "off",
    "import/order": [
      "error",
      {
        pathGroupsExcludedImportTypes: ["builtin"],
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
      },
    ],
    "react/prop-types": "off",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "react/react-in-jsx-scope": "off",
    "react/self-closing-comp": [
      "error",
      {
        component: true,
        html: true,
      },
    ],
    "react/display-name": "off",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/consistent-type-exports": [
      "error",
      { fixMixedExportsWithInlineTypeSpecifier: true },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/array-type": ["error", { default: "array" }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { caughtErrors: "all", args: "all", argsIgnorePattern: "^_" },
    ],
  },
};
