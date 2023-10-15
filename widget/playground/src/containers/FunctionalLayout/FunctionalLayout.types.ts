import type { WalletType } from '@rango-dev/wallets-shared';

export interface WalletSectionProps {
  onForward: () => void;
  value?: WalletType[];
}
