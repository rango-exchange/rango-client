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

On **Tron**:
- Switch account only works if the page is **reloaded after the multiple Tron accounts have been connected** — without that reload, the wallet does not fire the account-change event at all.

When connected to **both EVM and Solana simultaneously**:
- Only the **first connected namespace** properly receives events.
- The **second namespace** does **not** receive `accountsChanged` events.
- This applies to the EVM + Solana combination, not to Tron.

#### ⚠️ Auto Connect
- **Auto connect is not supported**:
  - On **Solana**, there is no silent reconnection mechanism.
  - On **EVM**, the wallet always opens a popup when the dApp is not already connected.
  - On **Tron**, reconnecting isn't reliable because the injected Tron instance takes some time to load after the page opens — and since the other namespaces don't support eager connect either, auto connect was removed for Tron too (the namespace doesn't implement `canEagerConnect`).

---

More wallet information can be found in [readme.md](../readme.md).