import type { BlockchainMeta } from 'rango-sdk';

import { BlockchainCategories } from '@rango-dev/ui';
import { TransactionType } from 'rango-sdk';

export function getCategoryNetworks(chains: BlockchainMeta[]) {
  const supportedNetworks: Set<BlockchainCategories> = new Set();

  chains.forEach((chain) => {
    switch (chain.type) {
      case TransactionType.EVM:
        supportedNetworks.add(BlockchainCategories.EVM);
        break;
      case TransactionType.COSMOS:
        supportedNetworks.add(BlockchainCategories.COSMOS);
        break;
      case TransactionType.TRANSFER:
        supportedNetworks.add(BlockchainCategories.UTXO);
        break;
      default:
        supportedNetworks.add(BlockchainCategories.OTHER);
        break;
    }
  });

  return Array.from(supportedNetworks);
}
