# OKX Wallet
OKX Wallet integration for hub.  
[Homepage](https://www.okx.com/web3) | [Docs](https://www.okx.com/web3/build/docs)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

### Group

#### ✅ Solana
- Fully supported in this integration.
- No known limitations.

---

#### ⚠️ EVM
Supported networks :
- Ethereum  
- BSC  
- Polygon  
- Fantom  
- Arbitrum  
- Optimism  
- Cronos  
- Boba  
- Gnosis  
- Moonbeam  
- Moonriver  
- Harmony  
- Avalanche C-Chain


#### 🚧 Cosmos 
The wallet supports Cosmos, but it is **not implemented** in the current integration.


#### 🚧 TON
The wallet supports TON, but it is **not implemented** in the current integration.


#### 🚧 Sui
The wallet supports Sui, but it is **not implemented** in the current integration.


#### 🚧 UTXO Chains
The wallet supports UTXO-based networks, but they are **not implemented** in the current integration.

### Feature

#### ⚠️ Disconnect
After a dApp is disconnected, it **cannot reconnect automatically** unless the user also manually disconnects from the wallet itself.  

#### ⚠️ Switch Account
Switching accounts from the wallet interface **is not reflected in the dApp**.  
The previously connected account remains active until the user performs a **full disconnect and reconnect**.  


---

More wallet information can be found in [readme.md](../readme.md).
