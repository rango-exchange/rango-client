import type { ProviderMetadata } from '@hub3js/core';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import {
  CAIP_BITCOIN_CHAIN_ID,
  CAIP_BITCOINCASH_CHAIN_ID,
  CAIP_DOGECOIN_CHAIN_ID,
  CAIP_LITECOIN_CHAIN_ID,
} from '@rango-dev/wallets-core/namespaces/utxo';
import {
  type BlockchainMeta,
  evmBlockchains,
  solanaBlockchain,
  type TransferBlockchainMeta,
} from 'rango-types';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'ctrl';

/**
 * The UTXO chains Ctrl exposes, grouped under the single UTXO namespace, each paired
 * with its CAIP-2 (bip122) reference so accounts can be self-describing.
 */
export const UTXO_CHAINS = [
  { network: LegacyNetworks.BTC, caip: CAIP_BITCOIN_CHAIN_ID },
  { network: LegacyNetworks.LTC, caip: CAIP_LITECOIN_CHAIN_ID },
  { network: LegacyNetworks.DOGE, caip: CAIP_DOGECOIN_CHAIN_ID },
  { network: LegacyNetworks.BCH, caip: CAIP_BITCOINCASH_CHAIN_ID },
] as const;

export const SUPPORTED_UTXO_CHAINS: string[] = UTXO_CHAINS.map(
  (chain) => chain.network
);

export const metadata: ProviderMetadata = {
  name: 'Ctrl',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/xdefi/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/ctrl-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
    brave:
      'https://chromewebstore.google.com/detail/ctrl-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
    homepage: 'https://ctrl.xyz/',
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
            label: 'UTXO',
            value: 'UTXO',
            id: 'BTC',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter((chain): chain is TransferBlockchainMeta =>
                SUPPORTED_UTXO_CHAINS.includes(chain.name)
              ),
          },
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
