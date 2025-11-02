import { defineConfig, globalIgnores } from "eslint/config";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js"; // For access to eslint:recommended
import tseslint from "typescript-eslint"; // For TypeScript plugins

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended, // Ensures recommendedConfig is available for FlatCompat
});

const eslintConfig = defineConfig([
  ...compat.extends('eslint:recommended'),
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('next/typescript'),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.open-next/**',
    '.wrangler/**',
  ]),
  // Base ESLint recommended rules
  js.configs.recommended,

  // TypeScript configurations
  ...tseslint.configs.recommended, // Includes '@typescript-eslint/eslint-plugin' and '@typescript-eslint/parser'
  ...tseslint.configs.stylistic, // Additional stylistic rules for TypeScript

  // Next.js base rules and App Router specific rules
  ...compat.extends(
    "next",             // Base Next.js config (includes react, react-hooks, jsx-a11y, next plugins)
    "next/core-web-vitals", // Rules for Core Web Vitals optimization
    "next/typescript"   // TypeScript-specific rules for Next.js
  ),

  // Prettier (always place last to disable conflicting ESLint rules)
  ...compat.extends("prettier"),

  {
    // Apply rules to these file types
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Your custom rules
      "no-console": "off", // Disables warnings for console.log, console.warn, etc.
      "react/no-unescaped-entities": "off", // Allows unescaped entities in JSX (e.g., "Don't" instead of "Don&apos;t")

      // Recommended TypeScript-specific rules
      "@typescript-eslint/no-explicit-any": "warn", // Warns about using 'any' type, promoting stricter typing
      "@typescript-eslint/explicit-module-boundary-types": "warn", // Encourages explicit function return types for exported functions and public class methods
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Catches unused variables, but ignores those starting with '_' (e.g., for ignored function arguments)

      // Next.js App Router specific rules from @next/eslint-plugin-next
      "@next/next/no-async-client-component": "error", // Disallows async functions for Client Components, crucial for proper hydration
      "@next/next/no-img-element": "warn", // Warns against using standard <img> tags, encouraging the use of next/image for optimization
      "@next/next/no-html-link-for-pages": "warn", // Warns against using standard <a> tags for internal navigation, encouraging next/link for client-side routing
      "@typescript-eslint/consistent-type-imports": "error", // Enforces consistent use of 'import type' for type-only imports, helping with bundle optimization
    },
    // Settings for React
    settings: {
      react: {
        version: "detect", // Automatically detects the React version used in the project
      },
    },
  },
]);

export default eslintConfig;
