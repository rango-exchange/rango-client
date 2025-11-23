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
The disconnect function will not work for this wallet, as it attempts to invoke disconnect on the connect method for private key imported wallets.
If the user disconnects the dApp from the wallet itself, we won't disconnect ourself. But we will get disconnected after refreshing the page.
If the user connects the wallet to one account, switches to another account, and then disconnects one of the two from the wallet, the dApp automatically switches to the remaining account that wasn’t disconnected.



#### ⚠️ Switch Account
If you switch accounts while still connected to the application, the `accountChanged` event will only emit for the last connected namespace. In result of that, the account for previously connected namespaces will not get updated and requires a disconnect and reconnect to properly connect to the desired account.
Also, when you call connect on a previously connected namespace, it doesn't return the address of the new account the user switched to. To prevent the user from being stuck in such situation, we call `disconnect` on the wallet whenever user disconnects the wallet from the provider. This results in a limitation which is explained in the `Disconnect` section.


---

More wallet information can be found in [readme.md](../readme.md).
