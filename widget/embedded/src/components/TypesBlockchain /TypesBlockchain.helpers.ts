import { type BlockchainMeta } from 'rango-sdk';

import { FilterByType } from '../BlockchainList/BlockchainList.helpers';

import { BlockchainType } from './TypesBlockchain.types';

const chainslogo = {
  [BlockchainType.EVM]: ['ETH', 'BSC', 'POLYGON'],
  [BlockchainType.COSMOS]: ['COSMOS', 'OSMOSIS', 'JUNO'],
  [BlockchainType.UTXO]: ['BTC', 'LTC', 'BCH'],
  [BlockchainType.OTHER]: ['STARKNET', 'TRON', 'SOLANA'],
};

export const generateChainsLogo = (
  list: BlockchainMeta[],
  type: Exclude<BlockchainType, 'ALL'>
) =>
  list
    .filter((item) => FilterByType(item, type))
    .filter((item) => chainslogo[type].includes(item.name));
