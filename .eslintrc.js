module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:tailwindcss/recommended'
  ],
  ignorePatterns: ['dist', 'node_modules'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: {
    react: {
      version: 'detect'
    },
    tailwindcss: {
      whitelist: ['screen-fill']
    }
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'no-console': 'off',
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'no-restricted-syntax': 'off',
    'no-nested-ternary': 'off',
    'arrow-body-style': 'off',
    semi: [2, 'never'],
    'comma-dangle': ['error', 'never'],
    'default-param-last': 'off',
    'jsx-quotes': ['error', 'prefer-single'],
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/function-component-definition': 'off',
    'react/no-array-index-key': 'off',
    'react/button-has-type': [1, { button: true, submit: true, reset: true }],
    'operator-linebreak': ['off', 'none'],
    'import/extensions': [0],
    'import/no-extraneous-dependencies': [0],
    'jsx-a11y/label-has-associated-control': [0],
    'jsx-a11y/no-noninteractive-element-interactions': [0],
    'jsx-a11y/click-events-have-key-events': [0],
    'jsx-a11y/no-noninteractive-tabindex': [0],
    'jsx-a11y/control-has-associated-label': [0],
    'jsx-a11y/media-has-caption': [0]
  }
}
