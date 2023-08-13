import type { BlockchainMeta } from 'rango-sdk';

export interface PropTypes {
  list: BlockchainMeta[];
  selected?: BlockchainMeta | null;
  onChange: (blockchain: BlockchainMeta) => void;
  multiSelect?: boolean;
  selectedList?: BlockchainMeta[] | 'all';
}
