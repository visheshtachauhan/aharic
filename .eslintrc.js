module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    // Handle unused variables and imports
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true
    }],
    
    // Allow any type but warn about it
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // Console statements
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    
    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // React specific
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    
    // Next.js specific
    '@next/next/no-img-element': 'warn',
    
    // General
    'prefer-const': 'warn',
    '@typescript-eslint/no-namespace': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
    {
      // Override rules for test files
      files: ['**/*.test.ts', '**/*.test.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },
    {
      // Override rules for API routes
      files: ['app/api/**/*.ts'],
      rules: {
        'no-console': 'off'
      }
    }
  ]
}; 