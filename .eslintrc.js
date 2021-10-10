module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    semi: ['error', 'always'],
    'space-before-function-paren': 'error',
    'comma-dangle': ['error', 'only-multiline'],
    'no-use-before-define': 'off',
    'react/prop-types': 'off',
    noImplicitAny: 'off',
    camelcase: 'off',
  },
  globals: {
    React: true,
    JSX: true
  }
};
