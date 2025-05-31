# Trust Wallet
Trust Wallet integration for hub.  
[Homepage](https://trustwallet.com/) | [Docs](https://developer.trustwallet.com/developer/develop-for-trust/browser-extension)  


## Implementation notes/limitations

### Group

#### ⚠️ EVM & Solana
Trust Wallet supports both EVM and Solana, but **simultaneous connections across namespaces are unreliable**.  

### Feature

#### ⚠️ Switch Account
When connected to a **single namespace**:
- Switching **from a private key wallet to a full wallet** triggers a **switch account event**.
- Switching **from a full wallet to a private key wallet** emits **no event**.

When connected to **both namespaces simultaneously**:
- Only the **first connected namespace** (e.g., EVM or Solana) properly receives events.
- The **second namespace** does **not** receive `accountsChanged` events.

#### ⚠️ Auto Connect
- **Auto connect is not supported**:
  - On **Solana**, there is no silent reconnection mechanism.
  - On **EVM**, the wallet always opens a popup when the dApp is not already connected.

---

More wallet information can be found in [readme.md](../readme.md).