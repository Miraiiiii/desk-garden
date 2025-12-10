import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    rules: {
      'semi': ['error', 'never'],
      '@typescript-eslint/semi': ['error', 'never'],
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
