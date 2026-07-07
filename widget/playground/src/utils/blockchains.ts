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
      case TransactionType.TRANSFER:
        supportedNetworks.add(BlockchainCategories.UTXO);
        break;
      case TransactionType.COSMOS:
      case TransactionType.SOLANA:
      case TransactionType.TRON:
      case TransactionType.STARKNET:
      case TransactionType.TON:
      case TransactionType.SUI:
      case TransactionType.XRPL:
      case TransactionType.STELLAR:
      case TransactionType.HYPERLIQUID:
        supportedNetworks.add(BlockchainCategories.OTHER);
        break;
    }
  });

  return Array.from(supportedNetworks);
}
