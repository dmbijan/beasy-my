import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Downgrade noisy legacy-project rules to warnings so lint stays usable.
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'build/**', 'supabase/**', 'tests/**', '*.cjs', 'tailwind.config.ts', 'next.config.js', 'postcss.config.js', 'public/**', '.kilo/**'],
  },
]

export default eslintConfig
