import type { Wallet } from '../../types';

export type PropTypes = {
  blockchain: string;
  isSelected: (walletType: string, blockchain: string) => boolean;
  selectWallet: (wallet: Wallet) => void;
  onClickBack?: () => void;
};
