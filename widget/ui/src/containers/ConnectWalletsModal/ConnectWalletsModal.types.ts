import type { WalletInfo } from '../../components/index.js';
import type { WalletType } from '@hub3js/core';

export interface ConnectWalletsModalPropTypes {
  open: boolean;
  list: WalletInfo[];
  onSelect: (walletType: WalletType) => void;
  id: string;
  onClose: () => void;
  error?: string;
}
