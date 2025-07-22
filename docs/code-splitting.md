# Code Splitting

As explained in [this link](https://legacy.reactjs.org/docs/code-splitting.html), Code-Splitting is a feature supported by some bundlers that allows the creation of multiple bundles that can be loaded dynamically at runtime. This technique enables us to "lazily-load" only the necessary components for the user's current needs, significantly enhancing the performance of the application.


## What we did

- Splitting Signers from initial bundle


## What we are going to do

Currently, we've achieved a good initial bundle size based on analyses conducted using tools like `lighthouse`. Some potential future works that could contribute to the journey ahead are listed below:

- Implement retry mechanisms for dynamic imports to address issues with failing to import certain chunks.
- Maintain the applied changes to prevent future modifications from undoing the achieved results.
- Identify potential areas that can be dynamically imported.
- Attempt to enhance clients that have integrated widgets (like dapp) to improve overall performance.


## Technical Consideration

- Avoid small chunks, they don't add any value to user. they will have network overhead as well.
- Chunks will be built using esbuild's [splitting](https://esbuild.github.io/api/#splitting) option.
- Code splitting for libraries is off by default. To enable the option, add the "--splitting" parameter to the "build" script of that package.


## Notes

The `@arlert-dev/signer-solana` package is not dynamically imported because it has a major dependency ("@solana/web3.js") that is also a dependency in `@solflare-wallet/sdk`, which is used in `provider-solflare`. This dependency cannot be dynamically imported, so importing `@arlert-dev/signer-solana` dynamically would only result in a very small reduction in the bundle size.

