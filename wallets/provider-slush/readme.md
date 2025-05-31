# Slush
Slush integration for hub.  
[Homepage](https://slush.app/) | [Docs](https://docs.sui.io/standards/wallet-standard)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitation

### Group

#### ✅ Sui
Only supports the Sui blockchain.

### Feature

#### ❌ Switch Account
The wallet does not emit an event when the active account changes, making it difficult to detect account switches programmatically.

Regardless of the selected account in the wallet UI, Slush always connects to the first account.

#### ❌ Cross Browser
The wallet is only available on Chrome.

---

More wallet information can be found in [wallets readme](../readme.md).
