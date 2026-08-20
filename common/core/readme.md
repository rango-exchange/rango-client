# @rango-dev/common-core

Framework and domain agnostic helpers shared across the packages of this monorepo.

Anything living here must be generic, i.e. it should make sense outside of wallets,
widget, queue-manager or logging. If a helper only makes sense for one of those
domains, it belongs to that domain's package instead.

## Usage

```ts
import { dynamicImportWithRefinedError } from '@rango-dev/common-core';

const { DefaultEvmSigner } = await dynamicImportWithRefinedError(
  async () => await import('@rango-dev/signer-evm')
);
```

`dynamicImportWithRefinedError` runs the given lazy import and, if it fails,
throws an `Error` carrying a user friendly message and keeping the original
error as `cause`.
