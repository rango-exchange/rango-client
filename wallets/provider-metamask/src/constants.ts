import { type ProviderMetadata } from '@rango-dev/wallets-core';
import { type BlockchainMeta, evmBlockchains } from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'metamask';

export const metadata: ProviderMetadata = {
  name: 'MetaMask',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/metamask/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',
    brave:
      'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask',
    edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US',
    homepage: 'https://metamask.io/download/',
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
      value: {
        getSigners: async () => getSigners(getInstanceOrThrow()),
      },
    },
  ],
};
