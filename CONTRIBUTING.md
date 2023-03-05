## Release workflow

A release can be a lib or an app/client release. We are publishing our libs to `npm` and our apps to `vercel`.

If a package is app, you need to add the package name to `scripts/publish.config.mjs` and then after getting a `PROJECT_ID` from Vercel, you need to set it as enviroment variable as well.

### Prerelase

Our publish script will do these steps:

1. Get the last release (by using git tags) and calculate changes since then.
2. Bump the version and create an prerelase tag for the changed packages
3. Determine the target deplyement by using `publish.config.mjs`
4. Publish libs to `npm` and apps to `Vercel`

### Production relase

TBA
