import type { ProviderMetadata } from '@hub3js/core';

import {
  CAIP_BITCOIN_CHAIN_ID,
  isChainSupported as isBip122ChainSupported,
} from '@hub3js/bip122';
import { isEvmNamespace } from '@hub3js/evm';
import { isTronNamespace } from '@rango-dev/wallets-core/namespaces/tron';

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
            isChainSupported: isEvmNamespace,
          },
          {
            label: 'Tron',
            value: 'Tron',
            id: 'TRON',
            isChainSupported: isTronNamespace,
          },
          {
            label: 'BTC',
            value: 'UTXO',
            id: 'BTC',
            isChainSupported: isBip122ChainSupported([CAIP_BITCOIN_CHAIN_ID]),
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
