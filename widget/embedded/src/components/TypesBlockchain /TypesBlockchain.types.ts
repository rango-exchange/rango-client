export interface PropTypes {
  setType: (type: string) => void;
  type: string;
}

export enum BlockchainType {
  ALL = 'ALL',
  EVM = 'EVM',
  COSMOS = 'COSMOS',
  UTXO = 'UTXO',
  OTHER = 'OTHER',
}
