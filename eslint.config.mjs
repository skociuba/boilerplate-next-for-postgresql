// Flat config (ESLint 9). Zastępuje .eslintrc.js + .eslintignore — ESLint 9
// nie czyta już żadnego z nich.
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import importHelpers from 'eslint-plugin-import-helpers';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// eslint-config-next 15 jest jeszcze w starym formacie (natywny flat config
// ma dopiero wersja 16, dla Next 16) — FlatCompat tłumaczy go w locie.
// Rejestruje też pluginy react, react-hooks, import i jsx-a11y.
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default tseslint.config(
  {
    // Zamiast .eslintignore. Raporty i buildy to wygenerowane pliki.
    ignores: ['.next/', 'out/', 'coverage/', 'playwright-report/', 'test-results/', 'next-env.d.ts']
  },

  js.configs.recommended,
  ...compat.extends('next/core-web-vitals'),
  react.configs.flat.recommended,
  tseslint.configs.recommended,

  {
    plugins: { 'import-helpers': importHelpers },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'newline-before-return': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'import-helpers/order-imports': [
        'error',
        {
          newlinesBetween: 'always',
          groups: [
            '/^@/providers/',
            ['/^next/', 'module'],
            '/^@/styles/',
            '/^@/components/',
            '/^@/layout/',
            '/^@/ui/',
            '/^@/features/',
            '/^@/lib/',
            '/^@/hooks/',
            ['parent', 'sibling', 'index']
          ],
          alphabetize: { order: 'asc', ignoreCase: true }
        }
      ],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['error', { allow: ['warn', 'error'] }]
    }
  },

  // Reguły Testing Library tylko w testach jednostkowych. e2e/*.spec.ts to
  // Playwright — page.getByRole wygląda jak zapytanie z render(), więc
  // reguły brały go za błąd.
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    ignores: ['e2e/**'],
    ...testingLibrary.configs['flat/react'],
    languageOptions: {
      globals: globals.jest
    }
  },

  // Pliki konfiguracyjne narzędzi (jest, tailwind, postcss...) to CommonJS
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' }
  },

  // Na końcu: wyłącza reguły formatowania, które gryzłyby się z Prettierem,
  // i zgłasza różnice względem Prettiera jako błędy (jak wcześniej
  // plugin:prettier/recommended)
  prettierRecommended
);
