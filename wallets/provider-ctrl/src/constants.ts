import type { ProviderMetadata } from '@hub3js/core';

import { CAIP_CHAINS } from '@hub3js/caip';
import { isEvmNamespace } from '@hub3js/evm';
import { isSolanaNamespace } from '@hub3js/solana';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'ctrl';

/**
 * The UTXO chains Ctrl exposes, all grouped under the single UTXO namespace, as
 * fully-qualified CAIP-2 ids (`bip122:0000…e93`). These key the per-chain provider
 * instances and are what `isChainSupported` receives. Where a bare bip122 reference is
 * needed instead, derive it with `getChainIdFromCaip2ChainId` rather than listing it
 * alongside — the two would be free to drift.
 */
export const UTXO_CHAINS = [
  CAIP_CHAINS.BITCOIN,
  CAIP_CHAINS.LITECOIN,
  CAIP_CHAINS.DOGECOIN,
  CAIP_CHAINS.BITCOINCASH,
] as const;

/** The CAIP-2 id of a UTXO chain Ctrl supports. */
export type UtxoCaipChainId = (typeof UTXO_CHAINS)[number];

/**
 * Narrow an arbitrary CAIP-2 id to one of Ctrl's UTXO chains, so callers can index the
 * instance map without casting.
 */
export function isUtxoCaipChainId(chainId: string): chainId is UtxoCaipChainId {
  return UTXO_CHAINS.some((supported) => supported === chainId);
}

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
            isChainSupported: isEvmNamespace,
          },
          {
            label: 'UTXO',
            value: 'UTXO',
            id: 'BTC',
            isChainSupported: isUtxoCaipChainId,
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
      value: { getSigners: async () => getSigners(getInstanceOrThrow()) },
    },
  ],
};
