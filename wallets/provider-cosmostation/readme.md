# Cosmostation
Cosmostation Wallet integration for hub.  
[Homepage](https://www.cosmostation.io/) | [Docs](https://docs.cosmostation.io/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Group

#### Cosmos
Cosmostation supports the Cosmos ecosystem, but there are functional limitations related to account switching (see below).

#### ⚠️ Cross Browser
Cosmostation is **only available on Chromium-based browsers**  
(e.g., Chrome, Brave, Edge).  
It is **not supported** on Firefox or Edge.

### Feature

#### ⚠️ Switch Account
Cosmostation does **not provide a functional switch-account mechanism** for Cosmos.  
When the user switches accounts in the wallet, the dApp **is not notified**, and the session continues using the old account.

#### ⚠️ Auto Connect (Cosmos)
- Cosmos eager-connect is **dependent on EVM being connected first**.  
- If **EVM is not connected**, eager connect **will not work** for Cosmos.

---

More wallet information can be found in [readme.md](../readme.md).
