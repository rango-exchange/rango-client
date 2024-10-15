# Code Splitting

As explained [here](https://legacy.reactjs.org/docs/code-splitting.html), Code-Splitting is a feature supported by some bundlers that can create multiple bundles that can be dynamically loaded at runtime. Code-splitting can help us “lazy-load” just the things that are currently needed by the user, which can dramatically improve the performance of the app.

## First step

The best way to introduce code-splitting into the app is through the dynamic import() syntax. In the first step, we started to split by dynamically importing signers. Considering that the user does not need the code related to a signer till signing a transaction and there is already a loading state to fetch the "create transaction" API, signers seemed a suitable option to be dynamically imported. We tried to dynamically import signers which have some large dependencies which result in bigger chunks and we avoided dynamically importing signers which does not have large dependencies and result in very small chunks (less than 1KB). The reason for that is that creating such small chunks does not add any value because of the minimal reduction that make to the main bundle size and also in case of issues with the user’s Internet connection, it is possible to fail to import the chunk resulting in some unwanted situations. So we decided to dynamically import signers which really reduce the initial bundle size. Also, a retry mechanism should be added to resolve issues with failing to import a chunk.

_Note_: `@rango-dev/signer-solana` package is not imported dynamically because it has a major dependency ("@solana/web3.js") which is also a dependency in `@solflare-wallet/sdk` which is used in `provider-solflare` and can not be dynamically imported so importing `@rango-dev/signer-solana` dynamically will only have a very small reduction in bundle size.

## ESBuild configuration

As explained [here](https://legacy.reactjs.org/docs/code-splitting.html), code splitting is still a work in progress in esbuild which is used by us for building packages. When we try to dynamically import another package, it works correctly, but when we try to dynamically import from another file in the current package, splitting will not happen in the final built chunks. To resolve this issue "splitting" option should be passed to `esbuild.build`. Considering that there is a known ordering issue with import statements across code splitting chunks in esbuild and also it seems that maybe `splitting` option is not that stable in esbuild, we decided to enable splitting only when we are using dynamic imports in a package to import another file of the same package. To enable this option, `--splitting` should be added to `build` script of that package.

## Future Works

Currently, we have reached a good place in initial bundle size based on some analyses resulting by tools like `lighthouse`. Some possible works which can be suitable for the future of this journey are listed below:

- Implement some retry mechanisms for dynamic imports to resolve issues with failing to import some chunks.
- Maintain the applied changes to prevent future changes from damaging the achieved results.
- Detect possible areas that can be imported dynamically
- Try to improve clients which have integrated widget (like dapp) to improve the overall performance
