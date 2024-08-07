# How to migrate from Legacy to Hub (or v1)

## Keeping old implementation

Hub can be disabled from app configs so If you want to keep old implementation to support both versions, you need to take following steps:

1. Move all the files from `/src` into `/src/legacy`.
2. Open `src/legacy/index.ts` and add `const legacyProvider: LegacyProviderInterface = { ... }` then export the object as follows: `export { legacyProvider }`
3. Make sure const WALLET_ID for `config = {type: WALLET_ID,};` (in `legacy/index.ts`) is same as what you pass to NamespaceBuilder `.config('providerId', WALLET_ID)`. NamespaceBuilder explained in next section.
4. legacy provider should be exported from package but it needs to define a version. In next section we will how it can be done.

## Defining a version

Whenever you write a provider, you need to define a version for that provider. each version can have it's own interface to be implemented, versioning helps us to reduce changes on old implementations when a new version is out.

1. First create a `src/mod.ts`.
2. Then, add `--inputs src/mod.ts` at the end of `build` command in `package.json`
3. You can define a version as follows:

```ts
const versions = defineVersions()
  .version('0.0.0', legacyProvider)
  .version('1.0.0', provider)
  .build();


export { versions };
```

## Creating a new provider using Hub

In legacy terms we only had one provider that implemented everything to work with a wallet which means if it was a multichain wallet, you should figure it out one provider somehow.
In hub there are two separated layers to work with a wallet: `Provider` and `Namespace`. You can read more about them in `glossary.md`.

For creating a new provider, you will need to use this structure:

```
/src
    /namespaces
    provider.ts
    mod.ts       -> for defining version
```

Both  `provider` and `namespace` have a builder. that can be imported as follows:

```ts
import { ProviderBuilder } from '@rango-dev/wallets-core';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
```

You will create only one provider for each wallet (e.g. Phantom) but for each namespaces you will create a separate file using its name and then you can import a `NamespaceBuilder` to helps you build a namespace.

**Note:** Each namespace has a predefined actions that can be imported like this: `import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';`

**Note 2:** In hub we don't have any implicit functionality, all of them has placed in its namespace and we will use namespace directly. Most common actions has been placed in `wallets-core` and you can easily import them. Please take a look at `namespace.md`.

As an example you can take a look at `provider-phantom` to see this process in action.
