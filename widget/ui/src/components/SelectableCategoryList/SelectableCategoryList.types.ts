import type { BlockchainMeta } from 'rango-types';

export interface SelectableCategoryListPropTypes {
  setCategory: (type: string) => void;
  category: string;
  blockchains: BlockchainMeta[];
  isLoading?: boolean;
}

export enum BlockchainCategories {
  ALL = 'ALL',
  EVM = 'EVM',
  COSMOS = 'COSMOS',
  UTXO = 'UTXO',
  OTHER = 'OTHER',
}
