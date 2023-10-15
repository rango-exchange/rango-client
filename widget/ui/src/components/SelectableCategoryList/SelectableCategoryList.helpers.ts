import { type BlockchainMeta, TransactionType } from 'rango-sdk';

import { BlockchainCategories } from './SelectableCategoryList.types';

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

const blockchainslogo = {
  [BlockchainCategories.EVM]: ['ETH', 'BSC', 'POLYGON'],
  [BlockchainCategories.COSMOS]: ['COSMOS', 'OSMOSIS', 'JUNO'],
  [BlockchainCategories.UTXO]: ['BTC', 'LTC', 'BCH'],
  [BlockchainCategories.OTHER]: ['STARKNET', 'TRON', 'SOLANA'],
};

export const generateBlockchainsLogo = (
  list: BlockchainMeta[],
  type: Exclude<BlockchainCategories, 'ALL'>
) =>
  list
    .filter((item) => filterByType(item, type))
    .filter((item) => blockchainslogo[type].includes(item.name));
