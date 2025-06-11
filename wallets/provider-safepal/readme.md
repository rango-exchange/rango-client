# SafePal
SafePal Wallet integration for hub.  
[Homepage](https://www.safepal.com/) | [Docs](http://devdocs.safepal.com/Connect-wallet/Web/introduction.html)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Group

#### EVM & Solana
SafePal supports both EVM and Solana, which are implemented in this integration.  
The wallet also supports **TON, Sui, Tron, and Aptos**, but these namespaces are **not yet supported**.

### Feature

#### ⚠️ Switch Account
- On **Solana**, switching accounts triggers a **full page reload**.
- Since **auto-connect is not supported**, the wallet **does not reconnect automatically** after reload.
- This results in both EVM and Solana **becoming disconnected** after switching accounts.

#### ❌ Auto Connect
- **Auto-connect is not supported**, as the wallet does **not support silent eager connection** on either EVM or Solana.
- A **popup is always triggered** when attempting to connect.
- Due to this limitation, **eager connect has been removed** from this integration.



---

More wallet information can be found in [readme.md](../readme.md).