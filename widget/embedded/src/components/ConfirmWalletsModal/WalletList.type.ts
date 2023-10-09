import type { Wallet, WidgetConfig } from '../../types';

export type PropTypes = {
  chain: string;
  supportedWallets: WidgetConfig['wallets'];
  isSelected: (walletType: string, chain: string) => boolean;
  selectWallet: (wallet: Wallet) => void;
  multiWallets: boolean;
  config?: WidgetConfig;
  limit?: number;
  onShowMore: () => void;
};
