# Coinbase Wallet
Coinbase Wallet integration for hub.  
[Homepage](https://www.coinbase.com/wallet) | [Docs](https://docs.cdp.coinbase.com/wallet-sdk/docs/welcome)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Group

#### EVM & Solana
Coinbase Wallet supports both EVM and Solana.

### Feature

#### ⚠️ Switch Account
Switch account behavior is **unreliable**:
- On **Solana**, switching accounts causes a **full page reload**.
- When connected to **both EVM and Solana**, this reload can result in **incorrect account resolution**:
  - The wallet returns a **list of all connected accounts**, not just the active one.
  - The **current account is not guaranteed to be the first item** in the list—especially for EVM.
  - As a workaround, we currently **select the first returned account** as the active account.
  - This may lead to **incorrect account selection** after switching.

Due to this behavior, switch account functionality may not work properly in multi-namespace setups.

#### ⚠️ Cross Browser
Coinbase Wallet is **only available on Chrome**.

---

More wallet information can be found in [readme.md](../readme.md).
