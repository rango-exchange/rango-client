import { WalletType } from '@rango-dev/wallets-shared';

export interface Wallet {
  chain: string;
  address: string;
  walletType?: WalletType;
}
