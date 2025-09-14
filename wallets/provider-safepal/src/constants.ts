import { type ProviderMetadata } from '@rango-dev/wallets-core';
import { type BlockchainMeta, evmBlockchains } from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'safepal';
export const metadata: ProviderMetadata = {
  name: 'SafePal',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/safepal/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa',
    brave:
      'https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa',
    firefox:
      'https://addons.mozilla.org/en-US/firefox/addon/safepal-extension-wallet',
    homepage: 'https://www.safepal.com/download',
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
        ],
      },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners(getInstanceOrThrow()) },
    },
  ],
};
