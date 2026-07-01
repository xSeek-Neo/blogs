## Tools

### Code style

Formatting is handled by Oxfmt (not Rslint). Project defaults:

- Single quotes (`singleQuote`, `jsxSingleQuote`)
- No semicolons (`semi: false`)
- LF line endings, 100-char print width, trailing commas where valid in ES5+

Run `pnpm format` after edits, or enable format-on-save in your editor.

### Rslint

- Run `pnpm lint` to lint your code
- Run `pnpm lint:fix` to auto-fix lint issues

### Oxfmt

- Run `pnpm format` to format your code
- Run `pnpm format:check` to verify formatting in CI
