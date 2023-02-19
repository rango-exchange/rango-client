import { WalletType } from '@rangodev/wallets-shared';

export interface SelectableWallet {
  blockchain: string;
  walletType: WalletType;
  address: string;
  image: string;
  selected: boolean;
}
