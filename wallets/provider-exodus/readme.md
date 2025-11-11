# Exodus
Exodus Wallet integration for hub.  
[Homepage](https://www.exodus.com/) | [Docs](https://support.exodus.com/)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Group

#### ⚠️ EVM
Exodus only supports a **limited set of EVM networks**:  
- **Ethereum**  
- **BSC**  
- **Polygon**  
- **Avalanche (C-Chain)**  

Other EVM networks are not supported.


### Feature

#### ⚠️ Switch Account
Exodus does not expose any method to programmatically switch accounts (called “portfolios”).  
Users must **disconnect and reconnect** to change accounts.  
Transactions are only sent if the wallet is on the correct account, preventing mis-signed transactions.

#### ⚠️ Auto Connect
Exodus does not provide an eager connection mechanism for its **Solana wallet**.  
The only workaround is using the **EVM eager connect method**, which only works if the EVM namespace has been connected at least once before.  
If the wallet instance is unavailable, the integration will throw an error.

#### ⚠️ Cross Browser
Exodus Wallet is supported only on **Chromium-based browsers** (e.g., Chrome, Brave).  

---


More wallet information can be found in [readme.md](../readme.md).
