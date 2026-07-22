# @rango-dev/wallets-core

Core package for handling web3 wallets supported by Rango

> **⚠️ Deprecated — this package is being split up and moved to [hub3js](https://github.com/rango-exchange/hub3js).**
>
> Most of what lives here now ships as focused `@hub3js/*` packages. New code should import
> from those instead. The subpaths marked "not migrated yet" below are still served from this
> package and will keep working until their replacements are released.

## Migrating imports

| Old | New |
| --- | --- |
| `@rango-dev/wallets-core` | `@hub3js/core` |
| `.../store` | `@hub3js/core/store` |
| `.../utils` | `@hub3js/core/utils` |
| `.../namespaces/common` | `@hub3js/namespaces` + `@hub3js/std` |
| `.../namespaces/evm` | `@hub3js/evm` |
| `.../namespaces/solana` | `@hub3js/solana` |
| `.../namespaces/starknet` | `@hub3js/starknet` |
| `.../namespaces/stellar` | `@hub3js/stellar` |
| `.../namespaces/sui` | `@hub3js/sui` |
| `.../namespaces/ton` | `@hub3js/tvm` |
| `.../namespaces/xrpl` | `@hub3js/xrpl` |
| `.../namespaces/tron`, `.../namespaces/utxo`, `.../legacy` | Not migrated yet — still served from this package |

A couple of things worth noting:

- The `ton` namespace is published as **`@hub3js/tvm`**, not `@hub3js/ton`.
- `.../namespaces/common` was split in two: the shared operators, builders, hooks and types
  became `@hub3js/std` (imported via subpaths such as `@hub3js/std/operators` and
  `@hub3js/std/types`), while the namespace registry types moved to `@hub3js/namespaces`.
