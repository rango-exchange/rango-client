# Freighter Provider

Freighter integration for hub.  
[Homepage](https://www.freighter.app/) | [Docs](https://docs.freighter.app/docs/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Group

Freighter supports **Stellar**.

### Feature

#### ⚠️ Connect
Freighter reports a rejected connection request with code `-4`, not the `4001` checked by default. Stellar has no official rejection standard, so Freighter's connect action matches `-4` itself and reports it as `rejected`.

More wallet information can be found in [readme.md](../readme.md).
