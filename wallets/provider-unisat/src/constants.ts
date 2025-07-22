import type { BlockchainMeta, TransferBlockchainMeta } from 'rango-types';

import { type ProviderInfo } from '@arlert-dev/wallets-core';
import { Networks } from '@arlert-dev/wallets-shared';

export const WALLET_ID = 'unisat';

export const info: ProviderInfo = {
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
  ],
};
