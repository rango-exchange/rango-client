import { type BlockchainMeta, TransactionType } from 'rango-sdk';

import {
  CosmosCategoryIcon,
  EvmCategoryIcon,
  OtherCategoryIcon,
  UtxoCategoryIcon,
} from '../../icons';

import { BlockchainCategories } from './SelectableCategoryList.types';

export const blockchainCategoryIcons = {
  [BlockchainCategories.EVM]: EvmCategoryIcon,
  [BlockchainCategories.COSMOS]: CosmosCategoryIcon,
  [BlockchainCategories.UTXO]: UtxoCategoryIcon,
  [BlockchainCategories.OTHER]: OtherCategoryIcon,
};

export const blockchainCategoryLabel = {
  [BlockchainCategories.ALL]: 'All',
  [BlockchainCategories.EVM]: 'EVM',
  [BlockchainCategories.COSMOS]: 'Cosmos',
  [BlockchainCategories.UTXO]: 'UTXO',
  [BlockchainCategories.OTHER]: 'Other',
};

const filterByType = (blockchain: BlockchainMeta, type: string): boolean => {
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

export const hasAnyCategory = (
  list: BlockchainMeta[],
  blockchainType: string
) => list.some((blockchain) => filterByType(blockchain, blockchainType));

export const getCountCategories = (list: BlockchainMeta[]) => {
  const categoriesToCheck = Object.values(BlockchainCategories).filter(
    (category) => category !== BlockchainCategories.ALL
  );

  const categoriesCount = categoriesToCheck.reduce((count, category) => {
    const isCategoryPresent = list.some((blockchain) =>
      filterByType(blockchain, category)
    );
    return count + (isCategoryPresent ? 1 : 0);
  }, 0);

  return categoriesCount;
};
