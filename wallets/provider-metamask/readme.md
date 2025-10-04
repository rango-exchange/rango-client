# MetaMask
MetaMask Wallet integration for hub.  
[Homepage](https://metamask.io/) | [Docs](https://docs.metamask.io/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Group
MetaMask supports both **EVM** and **Solana**.

### Feature

#### ⚠️ Switch Account

MetaMask accounts only support one namespace at a time — either Solana or EVM, not both simultaneously. Because of that:

When an account switch happens, the wallet will emit the update based on whichever namespace (Solana or EVM) is currently active.

Even though the switchAccount notification depends on the active namespace, transactions are always executed on the correct account for the selected chain.

---

More wallet information can be found in [readme.md](../readme.md).
