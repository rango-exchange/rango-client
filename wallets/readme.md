# Introduction

A single interface for Web 3.0 wallets that seamlessly integrates 20+ wallets, bringing 50+ blockchains to handle complex tasks such as connecting wallets and performing transactions.

# Getting Started

First, you need to add `@rango-dev/wallets-react` to your project

```
yarn add @rango-dev/wallets-react

# or using NPM
npm install @rango-dev/wallets-react
```

You can only add some specific wallets you need or add all of them at once using:

```
yarn add @rango-dev/provider-all
```

If you need some specific wallets, take a look at `/wallets/` directory to see the list of available wallets (starts with `provider-*`).
For example, if you only need `phantom` and `metamask`, you can only add them separately using:

```
yarn add @rango-dev/provider-metamask
yarn add @rango-dev/provider-phantom
```

Then you need to pass them as a list to `wallets-react`. see next section.

# Usage

After adding the dependencies, you can use them. Using all supported wallets (`provider-all`):

```js
import { Provider } from '@rango-dev/wallets-react';
import { allProviders } from '@rango-dev/provider-all';

const providers = allProviders();

export function App() {
  const blockchains = [...] // An array of blockchains
  return (
    <Provider providers={providers} allBlockChains={blockchains}>
        ...
    </Provider>
  );
}

```

or some specific wallets:

```js
import { Provider } from '@rango-dev/wallets-react';
import * as metamask from '@rango-dev/provider-metamask';
import * as phantom from '@rango-dev/provider-phantom';


const providers = [metamask, phantom];

export function App() {
  const blockchains = [...] // An array of blockchains
  return (
    <Provider providers={providers} allBlockChains={blockchains}>
        ...
    </Provider>
  );
}
```

and now you can access to wallets by using `useWallets`.

```js
import { useWallets } from '@rango-dev/wallets-react';

function Example() {
  const { connect, state, disconnect } = useWallets();
  const walletState = state('metamask');

  const handleConnectWallet = async () => {
    if (walletState.connecting) return;
    try {
      if (!walletState.connected) {
        if (walletState.installed) {
          await connect(type);
        }
      } else {
        disconnect('metamask');
      }
    } catch (err) {
      setError('Error: ' + (err.message || 'Failed to connect wallet'));
    }
  };

  return <button onClick={handleConnectWallet}>connect</button>;
}
```

# Auto-Connect

With the use of auto-connect, after reloading the app, wallet provider will automatically attempt to connect to the last connected wallets. To use the auto-connect feature, you need to pass the `autoConnect` property to wallet provider:

```js
import { Provider } from '@rango-dev/wallets-react';
import { allProviders } from '@rango-dev/provider-all';

const providers = allProviders();

export function App() {
  const blockchains = [...] // An array of blockchains
  return (
    <Provider providers={providers} allBlockChains={blockchains} autoConnect>
        ...
    </Provider>
  );
}

```

For better user experience, wallet provider tries to connect to a wallet only when that wallet doesn’t need to open a confirmation pop-up. Please note that only some wallets support this feature for now.

# Example

- Demo for wallets: [Source](https://github.com/rango-exchange/rango-client/tree/next/wallets/demo)

# Wallets API Status

**Status:** ✅ Support, ⚠️ Partial Support, ❌ Unsupported, 🚧 Not Implemented

## By Group


| Wallet                                          | EVM | UTXO | Solana | Cosmos | TON | Tron | SUI | StarkNet |
| ----------------------------------------------- | --- | ---- | ------ | ------ | --- | ---- | --- | -------- |
| [Binance](provider-binance/readme.md)           | ✅  | 🚧   | 🚧     | 🚧     | 🚧  | 🚧  | 🚧  |    ❌    |
| [Bitget](provider-bitget/readme.md)             | ✅  | 🚧   | 🚧     | ❌     | ❌  | ✅  | ❌  |    ❌    |
| [Braavos](provider-braavos/readme.md)           | ❌  | ❌   | ❌     | ❌     | ❌  | ❌  | ❌  |    ✅    |
| [Brave](provider-brave/readme.md)               | ✅  | ❌   | ✅     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [CoinBase](provider-coinbase/readme.md)         | ✅  | ❌   | ✅     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [Cosmostation](provider-cosmostation/readme.md) | ✅  | ❌   | ❌     | ✅     | ❌  | ❌  | ❌  |    ❌    |
| [Enkrypt](provider-enkrypt/readme.md)           | ✅  | 🚧   | 🚧     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [Exodus](provider-exodus/readme.md)             | ⚠️  | 🚧   | ✅     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [Keplr](provider-keplr/readme.md)               | 🚧  | ❌   | ❌     | ✅     | ❌  | ❌  | ❌  |    ❌    |
| [Leap](provider-leap-cosmos/readme.md)          | 🚧  | ❌   | 🚧     | ✅     | ❌  | 🚧  | ❌  |    ❌    |
| [Ledger](provider-ledger/readme.md)             | ⚠️  | ❌   | ✅     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [MathWallet](provider-math-wallet/readme.md)    | ✅  | 🚧   | ✅     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [MetaMask](provider-metamask/readme.md)         | ✅  | ❌   | ✅     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [Phantom](provider-phantom/readme.md)           | ⚠️  | ⚠️   | ✅     | ❌     | ❌  | ❌  | ✅  |    ❌    |
| [OKX](provider-okx/readme.md)                   | ⚠️  | ⚠️   | ✅     | 🚧     | 🚧  | ❌  | 🚧  |    ❌    |
| [Rabby](provider-rabby/readme.md)               | ✅  | ❌   | ❌     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [Ready](provider-ready/readme.md)               | ❌  | ❌   | ❌     | ❌     | ❌  | ❌  | ❌  |    ✅    |
| [Slush](provider-slush/readme.md)               | ❌  | ❌   | ❌     | ❌     | ❌  | ❌  | ✅  |    ❌    |
| [SafePal](provider-safepal/readme.md)           | ✅  | 🚧   | 🚧     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [Solflare](provider-solflare/readme.md)         | ❌  | ❌   | ✅     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [Taho](provider-taho/readme.md)                 | ⚠️  | ❌   | ❌     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [Token Pocket](provider-tokenpocket/readme.md)  | ✅  | ❌   | 🚧     | ❌     | ❌  | ❌  | 🚧  |    ❌    |
| [Tron Link](provider-tron-link/readme.md)       | 🚧  | ❌   | ❌     | ❌     | ❌  | ❌  | ✅  |    ❌    |
| [Trust Wallet](provider-trust-wallet/readme.md) | ✅  | ❌   | ✅     | 🚧     | 🚧  | ❌  | 🚧  |    ❌    |
| [UniSat](provider-unisat/readme.md)             | ❌  | ⚠️   | ❌     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [Xverse](provider-xverse/readme.md)             | ❌  | ⚠️   | ❌     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [Tomo](provider-tomo/readme.md)                 | ✅  | ❌   | ❌     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [Coin98](provider-coin98/readme.md)             | ✅  | ❌   | ✅     | ❌     | ❌  | ❌  | ❌  |    ❌    |
| [GemWallet](provider-gemwallet/readme.md)       | ❌  | ❌   | ❌     | ❌     | ❌  | ❌  | ✅   |   ❌   |

## By Feature

| Wallet       | Switch Account | Switch Network | Auto Connect | Interface                 | Cross Browser |
| ------------ | -------------- | -------------- | ------------ | ------------------------- | ------------- |
| Binance      | ✅             | ✅             | ❌           | Injected                  | ❌            |
| Bitget       | ✅             | ✅             | ✅           | Injected                  | ❌            |
| Brave        | ✅             | ✅             | ✅           | Injected                  | ❌            |
| Braavos      | ✅             | ❌             | ✅           | Injected                  | ✅            |
| CoinBase     | ⚠️             | ✅             | ✅           | Injected                  | ❌            |
| Cosmostation | ⚠️             | ✅             | ⚠️           | Injected                  | ❌            |
| Enkrypt      | ✅             | ✅             | ✅           | Injected                  | ✅            |
| Exodus       | ❌             | ✅             | ⚠️           | Injected                  | ❌            |
| Keplr        | ✅             | ❌             | ❌           | Injected                  | ✅            |
| Ledger       | ✅             | ❌             | ❌           | Transport                 | ✅            |
| MathWallet   | ❌             | ❌             | ⚠️           | Injected                  | ❌            |
| MetaMask     | ✅             | ✅             | ✅           | Injected                  | ✅            |
| OKX          | ⚠️             | ✅             | ✅           | Injected                  | ✅            |
| Phantom      | ✅             | ✅             | ⚠️           | Wallet Standard, Injected | ✅            |
| Rabby        | ✅             | ✅             | ✅           | Injected                  | ✅            |
| Ready        | ✅             | ❌             | ✅           | Injected                  | ✅            |
| Slush        | ❌             | ❌             | ✅           | Wallet Standard           | ❌            |
| SafePal      | ✅             | ✅             | ❌           | Injected                  | ✅            |
| Solflare     | ⚠️             | ❌             | ✅           | Injected                  | ✅            |
| Taho         | ✅             | ✅             | ✅           | Injected                  | ✅            |
| Token Pocket | ✅             | ✅             | ✅           | Injected                  | ❌            |
| Trust Wallet | 🚧             | ✅             | ❌           | Injected                  | ✅            |
| TronLink     | ✅             | ❌             | ✅           | Injected                  | ❌            |
| Unisat       | ✅             | 🚧             | ❌           | Injected                  | ❌            |
| Xverse       | ⚠️             | 🚧             | ✅           | Injected                  | ❌            |
| Tomo         | ✅             | ✅             | ✅           | Injected                  | ❌            |
| Coin98       | ✅             | ✅             | ❌           | Injected                  | ❌            |
| GemWallet    | ✅             | ❌             | ⚠️           | Injected                  | ❌            |

# Supported Wallets (Legacy)

| Wallet         | Supported Chains                                                                                                        | Not Implemented                                   | Auto Connect Support | Source                               |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------- | ------------------------------------ |
rate ready to the hub)
| Safe           | EVM                                                                                                                     | -                                                 | &check;              | https://safe.global/                 |
| Solflare Snap  | Solana                                                                                                                  | -                                                 | &cross;              | https://solflare.com/metamask        |
| Station        | Terra Classic, Terra                                                                                                    | -                                                 | &cross;              | https://station.terra.money/         |
| Trezor         | Ethereum,Solana                                                                                                         | Solana                                            | &cross;              | https://trezor.io/                   |
| Wallet Connect | Evm,Solana,Cosmos                                                                                                       | Solana,Cosmos                                     | &cross;              | -                                    |
| XDefi          | EVM,Solana,Binance,BTC,LTC,Thorchain,Terra,Doge,Cosmos,Akash,Axelar,Crypto.org,Juno,Kujira,Mars,Osmosis,Stargaze,Stride |                                                   | &check;              | https://www.xdefi.io/                |
