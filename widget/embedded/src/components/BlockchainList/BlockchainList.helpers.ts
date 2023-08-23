import { type BlockchainMeta, TransactionType } from 'rango-sdk';

import { containsText } from '../../utils/common';
import { BlockchainType } from '../TypesBlockchain /TypesBlockchain.types';

export const FilterByType = (
  blockchain: BlockchainMeta,
  type: string
): boolean => {
  if (type === BlockchainType.ALL) {
    return true;
  } else if (type === BlockchainType.UTXO) {
    return blockchain.type === TransactionType.TRANSFER;
  } else if (type === BlockchainType.OTHER) {
    return (
      blockchain.type !== TransactionType.TRANSFER &&
      blockchain.type !== TransactionType.COSMOS &&
      blockchain.type !== TransactionType.EVM
    );
  }
  return blockchain.type === type;
};

export const filterBlockchains = (
  list: BlockchainMeta[],
  searchedFor: string,
  blockchainType: string
) =>
  list
    .filter((blockchain) => FilterByType(blockchain, blockchainType))
    .filter(
      (blockchain) =>
        containsText(blockchain.name, searchedFor) ||
        containsText(blockchain.displayName, searchedFor)
    );
