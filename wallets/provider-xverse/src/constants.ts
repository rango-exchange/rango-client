import type { BlockchainMeta, TransferBlockchainMeta } from 'rango-types';

import { type ProviderMetadata } from '@rango-dev/wallets-core';
import { Networks } from '@rango-dev/wallets-shared';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const XVERSE_INJECTION_DELAY_MS = 1000;
export const XVERSE_ACCESS_DENIED_ERROR_CODE = -32002;
export const WALLET_ID = 'xverse';

export const metadata: ProviderMetadata = {
  name: 'xverse',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/xverse/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/idnnbdplmphpflfnlkomgpfbpcgelopg',
    homepage: 'https://www.xverse.app/',
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
