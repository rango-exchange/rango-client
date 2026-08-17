import type { ProviderMetadata } from '@hub3js/core';

import { isTronNamespace } from '@rango-dev/wallets-core/namespaces/tron';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'tron-link';
export const TronOKRequestCode = 200;
export const TRONLINK_INJECTION_DELAY = 1000;
export const metadata: ProviderMetadata = {
  name: 'TronLink',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/tronlink/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec',
    brave:
      'https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec',
    homepage: 'https://www.tronlink.org',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'Tron',
            value: 'Tron',
            id: 'TRON',
            isChainSupported: isTronNamespace,
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
