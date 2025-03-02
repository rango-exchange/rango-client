import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';
import type { BlockchainMeta, EvmBlockchainMeta } from 'rango-types';

import { isEvmBlockchain, solanaBlockchain } from 'rango-types';

export function getBlockchainLogo(
  blockchains: BlockchainMeta[],
  blockchainName: string
) {
  return blockchains.find((blockchain) => blockchain.name === blockchainName)
    ?.logo;
}

export function getNamespaceSupportedChains(
  namespace: Namespace,
  blockchains: BlockchainMeta[]
): BlockchainMeta[] {
  switch (namespace) {
    case 'Solana':
      return solanaBlockchain(blockchains);

    case 'EVM':
      return blockchains.filter((chain): chain is EvmBlockchainMeta =>
        isEvmBlockchain(chain)
      );

    case 'UTXO':
      return [];

    case 'Cosmos':
      return [];

    case 'Starknet':
      return [];

    case 'Ton':
      return [];

    case 'Tron':
      return [];

    default:
      return [];
  }
}
