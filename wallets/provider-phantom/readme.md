# Phantom Provider
Phantom integration for hub.  
[Homepage](https://phantom.com/) | [Docs](https://docs.phantom.com/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitation

### Group

#### ❌ UTXO
Bitcoin support is temporarily disabled because Phantom no longer injects a Bitcoin instance, which caused errors for users. It will be re-enabled once Phantom restores Bitcoin injection.

#### ⚠️ EVM
Only supports Ethereum, Base, and Polygon.

### Feature

#### ⚠️ Auto Connect
On Sui, Phantom uses Solana's auto-connect mechanism.  
This means if Solana is not connected simultaneously, the auto-connect feature on Sui will not work properly.

---

More wallet information can be found in [readme.md](../readme.md).