import type { BlockchainMeta } from 'rango-sdk';

export interface PropTypes {
  list: BlockchainMeta[];
  searchedFor: string;
  blockchainCategory: string;
  onChange: (blockchain: BlockchainMeta) => void;
}
