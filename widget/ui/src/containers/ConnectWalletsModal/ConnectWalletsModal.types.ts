import type { WalletInfo } from '../../components/index.js';
import type { LegacyWalletType as WalletType } from '@rango-dev/wallets-core/legacy';

export interface ConnectWalletsModalPropTypes {
  open: boolean;
  list: WalletInfo[];
  onSelect: (walletType: WalletType) => void;
  id: string;
  onClose: () => void;
  error?: string;
}
