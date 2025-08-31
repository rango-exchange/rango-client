import type { BlockchainMeta, TransferBlockchainMeta } from 'rango-types';

import { type ProviderMetadata } from '@rango-dev/wallets-core';
import { Networks } from '@rango-dev/wallets-shared';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'unisat';

export const metadata: ProviderMetadata = {
  name: 'UniSat',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/unisat/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo',
    homepage: 'https://unisat.io/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'single',
        data: [
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
      value: { getSigners: async () => getSigners(getInstanceOrThrow()) },
    },
  ],
};
