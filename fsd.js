const baseConfig = require("./base");

const ALLOWED_PATH_GROUPS = [
  "@processes/**",
  "@pages/**",
  "@widgets/**",
  "@features/**",
  "@entities/**",
  "@shared/**",
].map((pattern) => ({
  pattern,
  group: "internal",
  position: "after",
}));

const PUBLIC_PATH_GROUPS = [
  "@app/**",
  "@processes/*/**",
  "@pages/*/**",
  "@widgets/*/**",
  "@features/*/**",
  "@entities/*/**",
  "@shared/*/*/*/**",
].map((pathGroup) => ({
  message: "Private imports are prohibited, use public imports instead",
  group: [pathGroup],
}));

const RELATIVE_PATH_GROUPS = [
  "../**/app",
  "../**/processes",
  "../**/pages",
  "../**/widgets",
  "../**/features",
  "../**/entities",
  "../**/shared",
].map((pathGroup) => ({
  message: "Prefer absolute imports instead of relatives (for root modules)",
  group: [pathGroup],
}));

const RESTRICTED_IMPORTS_PATH_PATTERNS = [
  ...PUBLIC_PATH_GROUPS,
  ...RELATIVE_PATH_GROUPS,
];

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...baseConfig,
  settings: {
    ...baseConfig.settings,
    "boundaries/elements": [
      {
        type: "app",
        pattern: "app/*",
      },
      {
        type: "processes",
        pattern: "processes/*",
      },
      {
        type: "pages",
        pattern: "pages/*",
      },
      {
        type: "widgets",
        pattern: "widgets/*",
      },
      {
        type: "features",
        pattern: "features/*",
      },
      {
        type: "entities",
        pattern: "entities/*",
      },
      {
        type: "shared",
        pattern: "shared/*",
      },
    ],
  },
  plugins: [...baseConfig.plugins, "boundaries"],
  rules: {
    ...baseConfig.rules,
    "no-restricted-imports": [
      "error",
      { patterns: RESTRICTED_IMPORTS_PATH_PATTERNS },
    ],
    "import/order": [
      "error",
      {
        pathGroups: ALLOWED_PATH_GROUPS,
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
    "boundaries/element-types": [
      2,
      {
        default: "disallow",
        message: "${file.type} is not allowed to import ${dependency.type}",
        rules: [
          {
            from: "app",
            allow: [
              "processes",
              "pages",
              "widgets",
              "features",
              "entities",
              "shared",
            ],
          },
          {
            from: "processes",
            allow: ["pages", "widgets", "features", "entities", "shared"],
          },
          {
            from: "pages",
            allow: ["widgets", "features", "entities", "shared"],
          },
          {
            from: "widgets",
            allow: ["features", "entities", "shared"],
          },
          {
            from: "features",
            allow: ["entities", "shared"],
          },
          {
            from: "entities",
            allow: ["shared", "entities"],
          },
          {
            from: "shared",
            allow: ["shared"],
          },
        ],
      },
    ],
  },
};
