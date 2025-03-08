import type { Wallet } from '../../types';

export type PropTypes = {
  chain: string;
  requiredChains?: string[];
  isSelected: (walletType: string, chain: string) => boolean;
  selectWallet: (wallet: Wallet) => void;
  limit?: number;
  onShowMore: () => void;
  onConnect?: (walletType: string) => void;
};
