import type { WalletInfo } from '../../components/index.js';
import type { WalletType } from '@arlert-dev/wallets-shared';

export interface ConnectWalletsModalPropTypes {
  open: boolean;
  list: WalletInfo[];
  onSelect: (walletType: WalletType) => void;
  id: string;
  onClose: () => void;
  error?: string;
}
