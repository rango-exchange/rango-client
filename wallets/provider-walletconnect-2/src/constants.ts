import type { ProviderMetadata } from '@hub3js/core';

import { Networks } from '@rango-dev/wallets-shared';
import {
  type BlockchainMeta,
  type EvmBlockchainMeta,
  isEvmBlockchain,
  type TransferBlockchainMeta,
} from 'rango-types';

import getSigners from './signer.js';

export const WALLET_ID = 'wallet-connect-2';

export const metadata: ProviderMetadata = {
  name: 'WalletConnect',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/walletconnect/icon.svg',
  extensions: {
    homepage: 'https://walletconnect.com/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'single',
        data: [
          {
            label: 'EVM',
            value: 'EVM',
            id: 'ETH',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter((chain): chain is EvmBlockchainMeta =>
                isEvmBlockchain(chain)
              ),
          },
          {
            label: 'BTC',
            value: 'UTXO',
            id: 'BTC',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter(
                (chain): chain is TransferBlockchainMeta =>
                  chain.name === Networks.BTC
              ),
          },
        ],
      },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners() },
    },
    {
      name: 'details',
      value: {
        mobileWallet: true,
        showOnMobile: true,
      },
    },
  ],
};
