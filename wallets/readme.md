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

# Supported Wallets

| Wallet         | Supported Chains                                        | Not Implemented                      | Auto Connect Support | Source                                     |
| -------------- | ------------------------------------------------------- | ------------------------------------ | -------------------- | ------------------------------------------ |
| ArgentX        | Starknet                                                | -                                    | &check;              | https://www.argent.xyz/                    |
| Binance Wallet | Binance,BSC,ETH                                         | -                                    | &cross;              | https://www.bnbchain.org/en/binance-wallet |
| Bitget         | EVM,Tron,Solana,Cosmos,Starknet,Aptos,Arweave           | Solana,Cosmos,Starknet,Aptos,Arweave | &check;              | https://web3.bitget.com/                   |
| Braavos        | Starknet                                                | -                                    | &check;              | https://braavos.app/                       |
| Brave          | EVM, Solana                                             | -                                    | &check;              | https://brave.com/wallet/                  |
| Clover         | EVM, Solana,Polkadot,Kadena,Aptos,BTC,Doge              | Polkadot,Kadena,Aptos,BTC,Doge       | &check;              | https://wallet.clover.finance              |
| Coin98         | EVM,Solana,Cosmos,TRON,Ton,Thorchain,Terra,BTC          | Cosmos,TRON,Ton,Thorchain,Terra,BTC  | &cross;              | https://coin98.com/wallet                  |
| Coinbase       | EVM,Solana                                              | -                                    | &check;              | https://www.coinbase.com/wallet            |
| Cosmostation   | EVM,Cosmos,Aptos,Sui                                    | Aptos,Sui                            | &check;              | https://cosmostation.io/                   |
| Enkrypt        | EVM                                                     | BTC,Fantom,Cardano,Algorand          | &check;              | https://www.enkrypt.com/                   |
| Exodus         | BTC,ETH,BSC,Fantom,Cardano,Polygon,Solana,Avax,Algorand | BTC,Fantom,Cardano,Algorand          | &check;              | https://www.exodus.com/                    |
| Frontier       | EVM,Solana,Cosmos,Polkadot                              | Cosmos,Polkadot                      | &check;              | https://frontier.xyz/                      |
| Halo           | -                                                       | -                                    | &cross;              | https://halo.social/                       |
| Keplr          | Cosmos                                                  | -                                    | &cross;              | https://www.keplr.app/                     |
| Leap Cosmos    | Cosmos                                                  | Cosmos                               | &cross;              | https://www.leapwallet.io/cosmos           |
| Math Wallet    | BTC,EVM,Solana,Aptos,Tron,Polkadot,Cosmos               | BTC,Aptos,Tron,Polkadot,Cosmos       | &check;              | https://mathwallet.org/en-us/              |
| Metamask       | EVM                                                     | -                                    | &check;              | -                                          |
| OKX            | EVM,Solana,Cosmos                                       | Cosmos                               | &check;              | https://www.okx.com/web3                   |
| Phantom        | Solana,Ethereum,Polygon                                 | Ethereum,Polygon                     | &check;              | -                                          |
| Safe           | EVM                                                     | -                                    | &check;              | https://safe.global/                       |
| SafePal        | EVM,Solana,BTC,Tron,LTC,Doge,Aptos,TON                  | BTC,Tron,LTC,Doge,Aptos,TON          | &cross;              | https://www.safepal.com/                   |
| Station        | Terra Classic, Terra                                    | -                                    | &cross;              | https://station.terra.money/               |
| Taho           | ETH,Polygon,Arbitrum,Arbitrum,Avax,Binance,Fantom       | Fantom                               | &cross;              | https://taho.xyz/                          |
| TokenPocket    | EVM                                                     | -                                    | &check;              | https://extension.tokenpocket.pro/#/       |
| TronLink       | Tron                                                    | -                                    | &cross;              | -                                          |
| Trust Wallet   | EVM,Solana                                              | Solana                               | &check;              | https://trustwallet.com/                   |
| Wallet Connect | Evm,Solana,Cosmos                                       | Solana,Cosmos                        | &cross;              | -                                          |
| XDefi          | EVM,Solana,Binance,BTC,LTC,Thorchain,Terra,Doge,Cosmos  | Doge,Cosmos                          | &check;              | https://www.xdefi.io/                      |
