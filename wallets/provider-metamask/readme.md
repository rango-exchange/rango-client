# MetaMask
MetaMask Wallet integration for hub.  
[Homepage](https://metamask.io/) | [Docs](https://docs.metamask.io/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Group
MetaMask supports both **EVM** and **Solana**.

### Feature

#### ⚠️ Switch Account

In MetaMask, you can have only one active account at a time, which may belong to either the Solana or EVM namespace. When you connect to MetaMask, it connects to the currently active account—this account could belong to either namespace. Additionally, MetaMask may also establish a random connection to another account from the opposite namespace.

When a user switches accounts in MetaMask, the wallet emits an update event tied to the currently active namespace—either EVM or Solana.
The switchAccount notification is scoped to that active namespace, meaning only the relevant provider will receive the update.

Regardless of which namespace triggers the event, MetaMask always executes transactions using the correct account for the selected chain.
This ensures consistent behavior and prevents cross-namespace conflicts between Solana and EVM contexts.

---

More wallet information can be found in [readme.md](../readme.md).
