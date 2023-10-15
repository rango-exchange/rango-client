import type { WalletTypes } from '@rango-dev/wallets-shared';
import type { WidgetConfig } from '@rango-dev/widget-embedded';

export interface PropTypes {
  onBack: () => void;
  configWallets: WidgetConfig['wallets'];
  allWallets: MapSupportedWallet[];
}

type MapSupportedWallet = {
  title: string;
  logo: string;
  type: WalletTypes;
  networks: string[];
};
