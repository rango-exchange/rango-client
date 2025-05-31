# Rabby
Rabby Wallet integration for hub.  
[Homepage](https://rabby.io/) | [Docs](https://rabby.io/docs/integrating-rabby-wallet)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Group

####  EVM
Rabby only supports the EVM namespace.

### Feature

#### ⚠️ Auto Connect
Auto connect is **not supported**, as Rabby does **not allow silent connection checks**.  
This means the user must always manually approve connections—there is no way to detect connection status programmatically without triggering a popup.

---

More wallet information can be found in [readme.md](../readme.md).
