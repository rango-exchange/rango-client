# Phantom Provider
Phantom integration for hub.  
[Homepage](https://phantom.com/) | [Docs](https://docs.phantom.com/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitation

### Group

#### ⚠️ UTXO
Only supports Bitcoin.

#### ⚠️ EVM
Only supports Ethereum, Base, and Polygon.

### Feature

#### ⚠️ Auto Connect
On Sui, Phantom uses Solana's auto-connect mechanism.  
This means if Solana is not connected simultaneously, the auto-connect feature on Sui will not work properly.

---

More wallet information can be found in [readme.md](../readme.md).