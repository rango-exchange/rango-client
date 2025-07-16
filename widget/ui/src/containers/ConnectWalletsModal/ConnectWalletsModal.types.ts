import type { WalletInfo } from '../../components/index.js';
import type { InstallObjects, WalletType } from '@rango-dev/wallets-shared';

export interface ConnectWalletsModalPropTypes {
  open: boolean;
  list: WalletInfo[];
  onSelect: (walletType: WalletType) => void;
  getWalletLink: (walletType: WalletType) => string | InstallObjects;
  checkHasDeepLink: (walletType: WalletType) => boolean;
  id: string;
  onClose: () => void;
  error?: string;
}
