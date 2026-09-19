# Braavos
Braavos Wallet integration for hub.  
[Homepage](https://braavos.app/) | [Docs](https://docs.braavos.app/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations


### Feature
#### ⚠️ Connect Rejection
When the user rejects a connection, Braavos throws the same `Error during connection` error as a real failure, so the rejection **can't be told apart from a real failure**. It's reported as a regular connection error.

---

More wallet information can be found in [readme.md](../readme.md).
