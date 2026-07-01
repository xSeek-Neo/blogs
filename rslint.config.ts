import { defineConfig, globalIgnores, reactHooksPlugin, reactPlugin, ts } from '@rslint/core'

// Code style (single quotes, no semicolons) is enforced by Oxfmt — see .oxfmtrc.json
export default defineConfig([
  globalIgnores(['dist/**', 'node_modules/**']),
  ts.configs.recommended,
  reactPlugin.configs.recommended,
  reactHooksPlugin.configs.recommended,
  {
    rules: {
      // customize rules here
      semi: 'off',
      quotes: 'off',
    },
  },
])
