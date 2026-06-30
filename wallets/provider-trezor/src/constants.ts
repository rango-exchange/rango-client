import type { ProviderMetadata } from '@hub3js/core';

import { Networks, WalletTypes } from '@rango-dev/wallets-shared';
import { type BlockchainMeta } from 'rango-types';

import getSigners from './signer.js';

export const WALLET_ID = WalletTypes.TREZOR;

export const metadata: ProviderMetadata = {
  name: 'Trezor',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/trezor/icon.svg',
  extensions: {
    homepage: 'https://trezor.io/learn/a/download-verify-trezor-suite',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'single',
        data: [
          {
            label: 'Ethereum',
            value: 'EVM',
            id: 'ETH',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter(
                (chain) => chain.name === Networks.ETHEREUM
              ),
          },
        ],
      },
    },
    {
      name: 'derivationPath',
      value: {
        data: [
          {
            id: 'metamask',
            label: `Metamask (m/44'/60'/0'/0/index)`,
            namespace: 'EVM',
            generateDerivationPath: (index: string) => `44'/60'/0'/0/${index}`,
          },
          {
            id: 'ledgerLive',
            label: `LedgerLive (m/44'/60'/index'/0/0)`,
            namespace: 'EVM',
            generateDerivationPath: (index: string) => `44'/60'/${index}'/0/0`,
          },
          {
            id: 'legacy',
            label: `Legacy (m/44'/60'/0'/index)`,
            namespace: 'EVM',
            generateDerivationPath: (index: string) => `44'/60'/0'/${index}`,
          },
        ],
      },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners() },
    },
  ],
};
