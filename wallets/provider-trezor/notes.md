## @trezor/connect-web is cjs

Our packages should be ESM-only. One of our dependencies, `@trezor/connect-web` is CJS, We first tried to bundle a transpiled version of the `@trezor/connect-web` package, but it has some problems with `.default`-thing. you can add `--external-all-except @trezor/connect-web` to `build` and try to link to our dApp.

There are two workaround for solving this:

1. Consider user to have a bundler/tool to transpile it on host (e.g. Vite).
2. Remove the provider from `provider-all` and add besides `privder-all` separately in our dApp. This way we ensure all the `provider-all` dependencies include only ESM packages and when some is using `embedded` there is no need to transpile CJS to ESM and our `embedded` can be used directly.

We are going with the first one from the beginning so we will keep it for now.
In future, we need to investigate and somehow figure out this problem and be ESM-only.
