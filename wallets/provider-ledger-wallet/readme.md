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

---

More wallet information can be found in [readme.md](../readme.md).
