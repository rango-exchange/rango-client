import { type ProviderMetadata } from '@rango-dev/wallets-core';
import {
  type BlockchainMeta,
  evmBlockchains,
  tronBlockchain,
} from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'bitget';
export const TronOKRequestCode = 200;
export const metadata: ProviderMetadata = {
  name: 'Bitget',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/bitget/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak',
    brave:
      'https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak',
    homepage: 'https://web3.bitget.com/en/wallet-download?type=1',
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
          {
            label: 'Tron',
            value: 'Tron',
            id: 'TRON',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              tronBlockchain(allBlockchains),
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
