import type { ProviderMetadata } from '@hub3js/core';

import { isEvmNamespace } from '@hub3js/evm';
import { isSolanaNamespace } from '@hub3js/solana';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'metamask';
export const WALLET_STANDARD_NAME = 'MetaMask';
export const SOLANA_WALLET_STANDARD_MAINNET = 'solana:mainnet';
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
            isChainSupported: isEvmNamespace,
          },
          {
            label: 'Solana',
            value: 'Solana',
            id: 'SOLANA',
            isChainSupported: isSolanaNamespace,
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
