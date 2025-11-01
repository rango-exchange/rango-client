# Xverse Provider
Xverse integration for hub.  
[Homepage](https://www.xverse.app/) | [Docs](https://docs.xverse.app/sats-connect)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitation

### Group

#### ⚠️ UTXO
Only supports **Bitcoin**.

### Feature

#### ❌ Auto Connect
Xverse Wallet doesn’t support **auto-connect**.

#### ⚠️ Disconnect Handling
The wallet does **not provide any event or notification** when the user disconnects directly from the wallet interface.  
As a result, the dApp remains unaware of the disconnection, and the session continues until the user manually disconnects from within the dApp.

---

More wallet information can be found in [readme.md](../readme.md).
