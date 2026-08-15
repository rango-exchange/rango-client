# Noir Wallet Provider

Noir Wallet integration for hub.
[Homepage](https://www.zknoir.com/) | [Docs](https://github.com/NoirWallet/noir-wallet-sdk)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitation

### Group

#### ⚠️ UTXO

Only supports Zcash.

### Feature

#### ⚠️ Sign transaction

It only supports Zcash transparent transactions.

#### ⚠️ Switch Account

The wallet emits an empty array as switch account event when it gets locked and the namespace gets disconnected.

---

More wallet information can be found in [readme.md](../readme.md).
