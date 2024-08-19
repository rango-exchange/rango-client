# Notes
    
## Workaround for `client.d.ts` bug

`@walletconnect/modal@2.6.2` has an type issue which breaks our build. see `/patches` for more detail.

Until they fixed them, we are bundling `@walletconnect/modal` into our `dist`. and also `wc-types` is a copy-paste of the original type but the bug has been fixed there. Since `WalletConnectModal` exists in our type outputs, it's been solved temporarily in this way.

For sum up,
`@walletconnect/modal` will be bundle alongside our provider, so i moved `@walletconnect/modal` from `dependencies` to `devDependencies` to not be installed on host machine. And for our declaration files i've included the fix in `wc-types.d.ts`. so the host machine won't need to install `@walletconnect/modal` by itself.
At the same time we need `patch-package` here, to be able to develop the provider. so it will be need for development,

After `@walletconnect/modal` fixed the problem, we can revert these changes.


