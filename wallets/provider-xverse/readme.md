# Xverse Provider

Xverse integration for hub.  
[Homepage](https://www.xverse.app/) | [Docs](https://docs.xverse.app/sats-connect)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitation

### Group

#### ⚠️ UTXO

Only supports **Bitcoin**.

### Feature

#### ⚠️ Disconnect Handling
The wallet's disconnect event is not working properly.  
As a result, the dApp remains unaware of the disconnection, and the session continues until the user manually disconnects from within the dApp.
#### ⚠️ Switch Account

Currently, switching accounts on Xverse is not working correctly, which causes the wallet to disconnect from the dApp.

---

More wallet information can be found in [readme.md](../readme.md).
