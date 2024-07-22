import type { BlockchainMeta } from 'rango-types';

export type PropTypes = {
  blockchain: BlockchainMeta;
  handleOpenChange: (open: boolean) => void;
  open: boolean;
};
