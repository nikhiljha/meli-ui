const a11yOff = Object.keys(require('eslint-plugin-jsx-a11y').rules)
  .reduce((acc, rule) => {
    acc[`jsx-a11y/${rule}`] = 'off';
    return acc;
  }, {});

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'react-app',
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'max-len': ['error', {
      code: 140,
      tabWidth: 2,
      ignoreTrailingComments: true,
    }],
    'consistent-return': 'off',
    'no-nested-ternary': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    // disable some rules from parents to avoid problems
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react/require-default-props': ['error', { ignoreFunctionalComponents: true }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'arrow-parens': ['error', 'as-needed'],
    'import/prefer-default-export': 'off',
    'object-curly-newline': ['error', {
      // assignments, params, any js object
      "ObjectExpression": { "multiline": true, "minProperties": 1 },
      // destructure
      "ObjectPattern": { "multiline": true, "minProperties": 3 },
      "ImportDeclaration": { "multiline": true, "minProperties": 3 },
      "ExportDeclaration": { "multiline": true, "minProperties": 3 },
    }],
    'react/jsx-props-no-spreading': 'off',
    ...a11yOff,
    'react/button-has-type': 'off',
    'no-param-reassign': 'off',
    '@typescript-eslint/camelcase': 'off',
    'react/prop-types': 'warn',
    'react/no-unescaped-entities': 'off',
  },
};
