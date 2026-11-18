# @rango-dev/provider-tonconnect
TonConnect Wallet integration for hub.  
[Homepage](https://ton.org/) | [Docs](https://docs.ton.org/ecosystem/ton-connect/overview)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

#### ⚠️ Initialization
You should pass the TonConnect configs when building the provider: `buildProvider({ manifestUrl })`. With `@rango-dev/provider-all`, pass them as `allProviders({ [WalletTypes.TON_CONNECT]: { manifestUrl } })`.

### Feature

#### ❌ Switch Account

Ton wallets don't emit account change events: https://github.com/ton-blockchain/ton-connect/blob/main/wallet-guidelines.md

#### ⚠️ Disconnect

Some Ton wallets like **Tonkeeper** don't emit disconnect events

---

More wallet information can be found in [readme.md](../readme.md).