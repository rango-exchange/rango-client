# Braavos
Braavos Wallet integration for hub.  
[Homepage](https://braavos.app/) | [Docs](https://docs.braavos.app/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations


### Feature

#### ⚠️ Connect
Braavos reports a rejected connection request with the same `Error during connection` message it uses for a real failure, so a rejection **can't be told apart** from other connection failures and is reported as `unknown`.

---

More wallet information can be found in [readme.md](../readme.md).
