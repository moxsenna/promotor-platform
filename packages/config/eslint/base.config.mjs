// Shared base ESLint flat config for the Promotor platform (spec 6.5).
// Dependency-free for M0: core rules only, no plugins yet. Consumers (e.g. the
// web app in T7) spread this array and add framework-specific configs.
// Note: only JS is linted here. A .ts/.tsx file typed against this base alone
// throws without a TypeScript parser, and `no-undef` would false-positive on
// browser/Node globals; consumers with TS must add typescript-eslint configs.
export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/coverage/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
    },
  },
];
