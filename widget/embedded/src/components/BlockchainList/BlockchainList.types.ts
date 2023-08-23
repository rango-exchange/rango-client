import type { BlockchainMeta } from 'rango-sdk';

export interface PropTypes {
  list: BlockchainMeta[];
  searchedFor: string;
  blockchainType: string;
  onChange: (blockchain: BlockchainMeta) => void;
}
