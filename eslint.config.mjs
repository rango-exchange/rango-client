import _import from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import destructuring from 'eslint-plugin-destructuring';
import jsxIdAttributeEnforcement from 'eslint-plugin-jsx-id-attribute-enforcement';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/*.js',
      '**/scripts',
      '**/vitest.config.ts',
    ],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended'
  ),
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: fixupPluginRules(_import),
      react,
      'react-hooks': fixupPluginRules(reactHooks),
      destructuring,
      'jsx-id-attribute-enforcement': jsxIdAttributeEnforcement,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        projectService: true,
      },
    },

    rules: {
      'no-extra-boolean-cast': 'off',
      'multiline-comment-style': 'error',
      'arrow-spacing': 'error',
      curly: ['error', 'all'],
      'no-else-return': 'error',
      'no-multiple-empty-lines': 'error',

      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],

      'import/order': [
        'error',
        {
          'newlines-between': 'always',

          groups: [
            'type',
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'object',
            'index',
          ],

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'import/first': 'error',
      'import/no-duplicates': 'error',

      'import/newline-after-import': [
        'error',
        {
          count: 1,
        },
      ],

      'react-hooks/rules-of-hooks': 'error',
      'react/no-array-index-key': 'error',
      'react/jsx-no-constructed-context-values': 'error',
      'react/jsx-key': 'error',
      'react/no-unescaped-entities': 'off',
      'destructuring/in-params': 'error',
      'destructuring/in-methods-params': 'error',
      'no-unused-vars': 'off',
      'no-throw-literal': 'off',
      'no-magic-numbers': 'off',
      camelcase: 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/only-throw-error': 'error',

      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1, 2],
          ignoreTypeIndexes: true,
        },
      ],

      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/no-floating-promises': 'error',

      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],

      '@typescript-eslint/no-mixed-enums': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-enum-initializers': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      'jsx-id-attribute-enforcement/missing-ids': [
        'error',
        {
          targetCustom: ['Button', 'IconButton'],
        },
      ],
    },
  },
];
