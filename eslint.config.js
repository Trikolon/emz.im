import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginLit from "eslint-plugin-lit";
import eslintPluginWc from "eslint-plugin-wc";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  // Base recommended configs
  js.configs.recommended,

  // TypeScript files (src directory)
  {
    files: ["src/**/*.ts"],
    plugins: {
      lit: eslintPluginLit,
      wc: eslintPluginWc,
    },
    rules: {
      ...eslintPluginLit.configs.recommended.rules,
      ...eslintPluginWc.configs.recommended.rules,

      // Stylistic preferences
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],

      // Allow any for specific use cases common in web components
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
    },
  },

  // TypeScript files - enable type-checked rules
  {
    files: ["src/**/*.ts", "*.ts"],
    extends: [...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // CommonJS Node.js files (scripts directory) - no type checking
  {
    files: ["scripts/**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        __dirname: "readonly",
        __filename: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "writable",
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
      },
    },
    rules: {
      // Allow require statements in .cjs files
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Ignore patterns
  {
    ignores: ["dist/", "node_modules/", "*.html", "*.css", "public/", ".github/", ".wrangler/"],
  },

  // Prettier compatibility - must be last
  eslintConfigPrettier,
);
