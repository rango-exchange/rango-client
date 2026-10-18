import type { ProviderMetadata } from '@hub3js/core';

import { isEvmNamespace } from '@hub3js/evm';
import { getChainIdFromCaip2ChainId } from '@hub3js/std/utils';
import {
  CAIP_BITCOIN_CHAIN_ID,
  isUtxoNamespace,
} from '@rango-dev/wallets-core/namespaces/utxo';

import getSigners from './signer.js';

export const WALLET_ID = 'wallet-connect-2';

export const metadata: ProviderMetadata = {
  name: 'WalletConnect',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/walletconnect/icon.svg',
  extensions: {
    homepage: 'https://walletconnect.com/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'single',
        data: [
          {
            label: 'EVM',
            value: 'EVM',
            id: 'ETH',
            isChainSupported: isEvmNamespace,
          },
          {
            label: 'BTC',
            value: 'UTXO',
            id: 'BTC',
            isChainSupported: (chainId: string) =>
              isUtxoNamespace(chainId) &&
              getChainIdFromCaip2ChainId(chainId) === CAIP_BITCOIN_CHAIN_ID,
          },
        ],
      },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners() },
    },
    {
      name: 'details',
      value: {
        mobileWallet: true,
        showOnMobile: true,
      },
    },
  ],
};
