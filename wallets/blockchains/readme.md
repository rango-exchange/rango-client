# @rango-dev/wallets-blockchains

Translation between Rango's chain vocabulary (`BlockchainMeta`, `TransactionType`,
`Networks`) and CAIP-2 chain ids.

```ts
import {
  convertBlockchainMetaToCaip,
  isBitcoinBlockchain,
} from '@rango-dev/wallets-blockchains';
```

## Why it is separate from `@hub3js/caip`

Providers are moving to hub3js, which holds no Rango domain logic. Splitting the two
puts that rule in the dependency graph rather than in review comments:

| Provider code | Speaks | Imports |
| --- | --- | --- |
| `constants.ts`, `namespaces/`, `actions/`, `builders/`, `ProviderMetadata`, `isChainSupported` | CAIP-2 only | `@hub3js/caip` |
| `signer.ts`, `signers/` | Rango names | this package |

The first row is what moves; after the CAIP-2 chain-support refactor none of it knows a
Rango chain name.

The second row is a conscious exception. A signer implements `GenericSigner<Transfer>`
from `rango-types`, so its input is a Rango transaction and `tx.asset.blockchain` is a
Rango name — every provider already depends on `rango-types` for exactly this, and no
signer moves to hub3js. The exception does not extend to resolving a name in provider
setup, keying an instance map by name, or deciding chain support by name; those have
CAIP equivalents.

Nothing here may move to hub3js. Anything expressible without `rango-types` belongs in
`@hub3js/caip` instead.
