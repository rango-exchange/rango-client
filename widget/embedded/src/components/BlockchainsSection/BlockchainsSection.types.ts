import type { BlockchainMeta } from 'rango-sdk';

export interface PropTypes {
  blockchains: BlockchainMeta[];
  type: 'from' | 'to';
  blockchain: BlockchainMeta | null;
  onChange: (blockchain: BlockchainMeta) => void;
  onMoreClick: () => void;
}
