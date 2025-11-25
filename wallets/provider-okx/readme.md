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

#### ⚠️ UTXO Chains

The wallet only supports bitcoin.

#### 🚧 Cosmos

The wallet supports Cosmos, but it is **not implemented** in the current integration.

#### 🚧 TON

The wallet supports TON, but it is **not implemented** in the current integration.

#### 🚧 Sui

The wallet supports Sui, but it is **not implemented** in the current integration.



### Feature

#### ⚠️ Disconnect

The disconnect function will not work for this wallet, as it attempts to invoke disconnect on the connect method for private key imported wallets.
If the user disconnects the dApp from the wallet itself, we won't disconnect ourself. But we will get disconnected after refreshing the page.
If the user connects the wallet to one account, switches to another account, and then disconnects one of the two from the wallet, the dApp automatically switches to the remaining account that wasn’t disconnected.



Here’s the updated **Switch Account** section with a concise mention that connection order affects switching accounts:

---

#### ⚠️ Switch Account

**Connection order also affects this behavior** depending on which namespace was connected first, some account updates may not propagate correctly across other namespaces. As a result, previously connected namespaces will not update automatically and require a manual disconnect and reconnect to sync the correct account.

Additionally, calling `connect` on a namespace that was already connected does not return the address of the newly selected account. To avoid leaving the user in an inconsistent state, we invoke a full wallet `disconnect` when the user disconnects the wallet from the provider.


---

More wallet information can be found in [readme.md](../readme.md).
