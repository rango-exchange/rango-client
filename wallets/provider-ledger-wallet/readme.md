# Ledger Wallet

Ledger Wallet integration for hub.  
[Homepage](https://www.ledger.com/) | [Docs](https://developers.ledger.com/docs/ledger-wallet-provider/overview)

## Implementation notes/limitations

### Group

#### ⚠️ EVM

Provider only supports a subset of EVM chains listed here in [constants.ts](./src/constants.ts).

### Feature

#### ❌ Auto Connect (Solana)

Auto connect is not supported for Solana. Ledger's Wallet Standard wallet doesn't expose its accounts until `standard:connect` is called, and it ignores the `silent` option, so there is no way to check for an existing session without opening the account selection modal.

#### ⚠️ Sign Transactions

Signing errors (e.g. a device error, or blind signing being disabled in the Solana app) are shown inside the Ledger Button modal, where the user can retry. Ledger only rejects the request once the modal is closed, so these errors reach the signer as "rejected by user".

### Dependencies

#### ⚠️ Pinned versions

The `@ledgerhq/ledger-wallet-provider*` packages and their peers (`@ledgerhq/device-management-kit`, `rxjs`, `xstate`, `purify-ts`) are pinned to exact versions on purpose. `ledger-wallet-provider-evm` and `ledger-wallet-provider-solana` declare these peers with exact versions, so using a range or bumping one package alone can install a second copy (e.g. of `device-management-kit`). Ledger's `instanceof` checks then fail across the copies, and signing fails with the modal's generic "An unexpected error occurred while signing your transaction".

To upgrade, bump the Ledger packages together, then set every peer to the exact version listed in the new `peerDependencies` of `ledger-wallet-provider-evm` and `ledger-wallet-provider-solana`. After `yarn install`, check that `node_modules` has only one copy of each.

Note: `@ledgerhq/device-management-kit` is pinned to the version those peers require (currently `1.11.0`), not to the latest on npm. `ledger-wallet-provider-core` also depends on that exact version, so a newer one would install a second copy.

---

More wallet information can be found in [readme.md](../readme.md).
