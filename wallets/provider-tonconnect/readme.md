# @rango-dev/provider-tonconnect
TonConnect Wallet integration for hub.  
[Homepage](https://ton.org/) | [Docs](https://docs.ton.org/ecosystem/ton-connect/overview)

More about implementation status can be found [here](../readme.md).

## Implementation notes/limitations

#### ⚠️ Initialization
You should provide TonConnect configs in configs.walletOptions[WalletTypes.TON_CONNECT] (which equals configs.walletOptions.tonconnect)

### Feature

#### ❌ Switch Account

Ton wallets don't emit account change events: https://github.com/ton-blockchain/ton-connect/blob/main/wallet-guidelines.md

#### ⚠️ Disconnect

Some Ton wallets like **Tonkeeper** don't emit disconnect events

#### ⚠️ Init

We set **'installed'** to `true` on initialization even if we can't initialize the TonConnect instance.
Instead, we throw an error when the user tries to connect and we haven't initialized the TonConnect instance.

---

More wallet information can be found in [readme.md](../readme.md).