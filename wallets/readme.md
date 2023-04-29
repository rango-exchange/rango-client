# Introduction

A single interface for Web 3.0 wallets that seamlessly integrates 20+ wallets, bringing 50+ blockchains to handle complex tasks such as connecting wallets and performing transactions. 

# Getting Started

First, you need to add `@rango-dev/wallets-core` to your project

```
yarn add @rango-dev/wallets-core

# or using NPM
npm install @rango-dev/wallets-core
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

Then you need to pass them as a list to `wallets-core`. see next section.

# Usage

After adding the dependencies, you can use them. Using all supported wallets (`provider-all`):

```js
import { Provider } from '@rango-dev/wallets-core';
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

```
import { Provider } from '@rango-dev/wallets-core';
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
import { useWallets } from '@rango-dev/wallets-core';

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


# Example

- Demo for wallets: [Source](https://github.com/rango-exchange/rango-client/tree/next/wallets/demo)



# Supported Wallets

| Wallet         | Supported Chains                                        | Not Implemented                     | Source                                     |
| -------------- | ------------------------------------------------------- | ----------------------------------- | ------------------------------------------ |
| Binance Wallet | Binance,BSC,ETH                                         | -                                   | https://www.bnbchain.org/en/binance-wallet |
| Brave          | EVM, Solana                                             | -                                   | https://brave.com/wallet/                  |
| Clover         | EVM, Solana,Polkadot,Kadena,Aptos,BTC,Doge              | Polkadot,Kadena,Aptos,BTC,Doge      | https://wallet.clover.finance              |
| Coin98         | EVM,Solana,Cosmos,TRON,Ton,Thorchain,Terra,BTC          | Cosmos,TRON,Ton,Thorchain,Terra,BTC | https://coin98.com/wallet                  |
| Coinbase       | EVM,Solana                                              | -                                   | https://www.coinbase.com/wallet            |
| Cosmostation   | EVM,Cosmos,Aptos,Sui                                    | Aptos,Sui                           | https://cosmostation.io/                   |
| Exodus         | BTC,ETH,BSC,Fantom,Cardano,Polygon,Solana,Avax,Algorand | BTC,Fantom,Cardano,Algorand         | https://www.exodus.com/                    |
| Frontier       | EVM,Solana,Cosmos,Polkadot                              | Cosmos,Polkadot                     | https://frontier.xyz/                      |
| Keplr          | Cosmos                                                  | -                                   | https://www.keplr.app/                     |
| Kucoin         | -                                                       | -                                   | https://kuwallet.com/                      |
| Leap Cosmos    | Cosmos                                                  | Cosmos                              | https://www.leapwallet.io/cosmos           |
| Math Wallet    | BTC,EVM,Solana,Aptos,Tron,Polkadot,Cosmos               | BTC,Aptos,Tron,Polkadot,Cosmos      | https://mathwallet.org/en-us/              |
| Metamask       | EVM                                                     | -                                   | -                                          |
| OKX            | -                                                       | -                                   | https://www.okx.com/web3                   |
| Phantom        | Solana                                                  | -                                   | -                                          |
| SafePal        | EVM,Solana,BTC,Tron,LTC,Doge,Aptos,TON                  | BTC,Tron,LTC,Doge,Aptos,TON         | https://www.safepal.com/                   |
| TokenPocket    | EVM                                                     | -                                   | https://extension.tokenpocket.pro/#/       |
| TronLink       | -                                                       | -                                   | -                                          |
| Trust Wallet   | EVM,Solana                                              | Solana                              | https://trustwallet.com/                   |
| Wallet Connect | -                                                       | -                                   | -                                          |
| XDefi          | EVM,Solana,Binance,BTC,LTC,Thorchain,Terra,Doge         | Doge                                | https://www.xdefi.io/                      |
