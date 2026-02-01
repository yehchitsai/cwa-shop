import js from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'

export default [
  {
    ignores: ['dist', 'node_modules']
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin
    },
    rules: {
      // React plugin recommended rules
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // Custom overrides
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'no-console': 'off',
      'no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true }
      ],
      'no-restricted-syntax': 'off',
      'no-nested-ternary': 'off',
      'arrow-body-style': 'off',
      semi: [2, 'never'],
      camelcase: 'off',
      'comma-dangle': ['error', 'never'],
      'default-param-last': 'off',
      'jsx-quotes': ['error', 'prefer-single'],
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/function-component-definition': 'off',
      'react/no-array-index-key': 'off',
      'react/button-has-type': [
        1,
        { button: true, submit: true, reset: true }
      ],
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
]
