import { BlockchainCategories } from '@rango-dev/ui';
import { type BlockchainMeta, TransactionType } from 'rango-sdk';

import { containsText } from '../../utils/common';

export const filterByType = (
  blockchain: BlockchainMeta,
  type: string
): boolean => {
  switch (type) {
    case BlockchainCategories.ALL:
      return true;
    case BlockchainCategories.UTXO:
      return blockchain.type === TransactionType.TRANSFER;
    case BlockchainCategories.OTHER:
      return (
        blockchain.type !== TransactionType.TRANSFER &&
        blockchain.type !== TransactionType.COSMOS &&
        blockchain.type !== TransactionType.EVM
      );
    default:
      return blockchain.type === type;
  }
};

export const filterBlockchains = (
  list: BlockchainMeta[],
  searchedFor: string,
  blockchainType: string
) =>
  list
    .filter((blockchain) => filterByType(blockchain, blockchainType))
    .filter(
      (blockchain) =>
        containsText(blockchain.name, searchedFor) ||
        containsText(blockchain.displayName, searchedFor)
    );
