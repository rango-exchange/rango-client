import type { WalletInfo } from '../../components';
import type { WalletType } from '@rango-dev/wallets-shared';

export interface ConnectWalletsModalPropTypes {
  open: boolean;
  list: WalletInfo[];
  onSelect: (walletType: WalletType) => void;
  onClose: () => void;
  error?: string;
}
