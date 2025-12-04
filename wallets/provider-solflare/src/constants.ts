import { type ProviderMetadata } from '@rango-dev/wallets-core';
import { type BlockchainMeta, solanaBlockchain } from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'solflare';
export const SOLFLARE_INJECTION_DELAY = 1000;
export const metadata: ProviderMetadata = {
  name: 'Solflare',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/solflare/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic',
    brave:
      'https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/solflare-wallet/',
    edge: 'https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic',
    homepage: 'https://solflare.com',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'Solana',
            value: 'Solana',
            id: 'SOLANA',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              solanaBlockchain(allBlockchains),
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
