import type { WalletInfoWithExtra } from '../../types';

export interface ConnectStatusProps {
  wallet: WalletInfoWithExtra;
  error?: string;
}
