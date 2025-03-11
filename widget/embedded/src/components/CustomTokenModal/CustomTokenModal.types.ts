import type { BlockchainMeta, Token } from 'rango-sdk';

export type PropTypes = {
  open: boolean;
  onClose: () => void;
  onExit: () => void;
  onSubmitClick: () => void;
  token: Token;
  blockchain: BlockchainMeta;
};
