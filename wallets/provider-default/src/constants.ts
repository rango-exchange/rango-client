import type { ProviderMetadata } from '@hub3js/core';

import { type BlockchainMeta, evmBlockchains } from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'default';
export const INJECTION_DELAY = 1000;

export const metadata: ProviderMetadata = {
  name: 'Default',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/default/icon.svg',
  /*
   * `default` is the fallback for any unrecognized injected EVM provider, so it
   * is only ever shown when `window.ethereum` is already present (see
   * `shouldShowDefaultInjectedWallet` in the widget). Its install link is never
   * surfaced, so there is no real homepage/extension to point users to.
   */
  extensions: {},
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
