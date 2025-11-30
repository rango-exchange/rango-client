# Bitget
Bitget Wallet integration for hub.  
[Homepage](https://web3.bitget.com/) | [Docs](https://web3.bitget.com/en/wallet/developer)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Feature

#### ⚠️ Connect (Tron)
Tron connection attempts can fail unpredictably, often returning an error on the **first or second try**.  
Users may need to **retry the connection** to successfully establish a Tron session.

#### ⚠️ Switch Account
Switching accounts in the Bitget Wallet triggers a **full page refresh**.
Switch account would break if a single namespace account is connected.
Switch account would disconnect wallet if the switched one has not connected yet.

#### ⚠️ Auto Connect
- **Tron auto-connect only works if EVM was previously connected.**  
- Tron does **not support silent connection**, so the integration relies on EVM eager-connect when available.
- If only Tron is selected, **auto-connect will not work**.

#### ⚠️ Cross Browser
Bitget Wallet is supported **only on Chromium-based browsers** (e.g., Chrome, Brave).

---

More wallet information can be found in [readme.md](../readme.md).
