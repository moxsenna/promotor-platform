// Shared base ESLint flat config for the Promotor platform (spec §6.5).
// Dependency-free for M0: core rules only, no plugins yet. Consumers (e.g. the
// web app in T7) spread this array and add framework-specific configs.
export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/coverage/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
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