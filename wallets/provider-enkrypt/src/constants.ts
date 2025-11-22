import { type ProviderMetadata } from '@rango-dev/wallets-core';
import { type BlockchainMeta, evmBlockchains } from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'enkrypt';
export const metadata: ProviderMetadata = {
  name: 'Enkrypt',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/enkrypt/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/enkrypt/',
    brave:
      'https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh',
    edge: 'https://microsoftedge.microsoft.com/addons/detail/enkrypt-ethereum-polkad/gfenajajnjjmmdojhdjmnngomkhlnfjl',

    homepage: 'https://www.enkrypt.com/',
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
