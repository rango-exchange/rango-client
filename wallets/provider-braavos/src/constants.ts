import type { ProviderMetadata } from '@hub3js/core';

import { isStarknetNamespace } from '@hub3js/starknet';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'braavos';
export const metadata: ProviderMetadata = {
  name: 'Braavos',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/braavos/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/braavos-smart-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma',
    brave:
      'https://chrome.google.com/webstore/detail/braavos-smart-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/braavos-wallet/',
    edge: 'https://microsoftedge.microsoft.com/addons/detail/braavos-wallet/hkkpjehhcnhgefhbdcgfkeegglpjchdc',
    homepage: 'https://braavos.app/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'Braavos',
            value: 'Starknet',
            id: 'STARKNET',
            isChainSupported: isStarknetNamespace,
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
