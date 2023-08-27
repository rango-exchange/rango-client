export interface PropTypes {
  setCategory: (type: string) => void;
  category: string;
}

export enum BlockchainCategories {
  ALL = 'ALL',
  EVM = 'EVM',
  COSMOS = 'COSMOS',
  UTXO = 'UTXO',
  OTHER = 'OTHER',
}
