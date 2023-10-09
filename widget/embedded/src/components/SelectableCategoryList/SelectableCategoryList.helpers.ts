import { type BlockchainMeta } from 'rango-sdk';

import { filterByType } from '../BlockchainList/BlockchainList.helpers';

import { BlockchainCategories } from './SelectableCategoryList.types';

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
