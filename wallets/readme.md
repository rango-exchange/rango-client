# Introduction

The libraries in Rango Client Wallets enable you to use the several wallets we support. You can use it to connect to your wallet, get accounts, switch networks, get signer, and offer wallet information such as a wallet's name, logo, supported chains and etc.

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

# Installation

Installing the wallets core library is a prerequisite for using wallets:

```
yarn add @rango-dev/wallets-core
```

We advise using the library of all providers if you wish to use all the wallets:

```
yarn add @rango-dev/provider-all
```

Install the necessary wallets library and submit it to the providers as an array if you wish to use the wallets of your choosing.

# Start Developing

The wallets core provider must be used, and it be included to the App.js file.
You send providers and blockchains to it:

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

and now you can use wallets by useWallets.

```js
import { useWallets } from '@rango-dev/wallets-core';

function example() {
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
