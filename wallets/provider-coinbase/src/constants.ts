import { type ProviderInfo } from '@rango-dev/wallets-core';
import {
  type BlockchainMeta,
  evmBlockchains,
  solanaBlockchain,
} from 'rango-types';

export const WALLET_ID = 'coinbase';

export const info: ProviderInfo = {
  name: 'Coinbase',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/coinbase/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
    brave:
      'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
    homepage: 'https://www.coinbase.com/wallet',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'EVM',
            value: 'EVM',
            id: 'ETH',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              evmBlockchains(allBlockchains),
          },
          {
            label: 'Solana',
            value: 'Solana',
            id: 'SOLANA',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              solanaBlockchain(allBlockchains),
          },
        ],
      },
    },
  ],
};
