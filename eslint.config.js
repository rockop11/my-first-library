import js from "@eslint/js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,  // Reglas recomendadas para JS
  ...tseslint.configs.recommended,  // Reglas recomendadas para TypeScript
  {
    // files: ["**/*.{ts}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      "simple-import-sort": simpleImportSort,  // Cargar el plugin correctamente
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": "error",
    },
    ignores: ['/dist/*']
  },
];

