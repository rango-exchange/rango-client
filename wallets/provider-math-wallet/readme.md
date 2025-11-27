# MathWallet
MathWallet integration for hub.  
[Homepage](https://mathwallet.org/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

#### ⚠️ Cross Browser
MathWallet is **only available on Chromium-based browsers**  
(e.g., Chrome, Brave, Edge).  
It is **not supported** on Firefox or Safari.

### Feature

#### ❌ Auto Connect (Solana)
MathWallet does **not** provide a silent or eager-connect mechanism for **Solana**.  
A manual approval popup is required each time.

#### ❌ Switch Account
MathWallet does **not offer a functional switch-account mechanism**.  
Account changes inside the wallet **do not notify the dApp**, and the session remains tied to the originally connected account.

#### ❌ Switch Network
MathWallet does **not support programmatic network switching**.  
All network changes must be performed manually within the wallet.

#### ⚠️ Single Namespace Limitation
MathWallet can only maintain **one active namespace connection at a time**.  
Users cannot be simultaneously connected to multiple namespaces (e.g., Solana + EVM).

---

More wallet information can be found in [readme.md](../readme.md).
