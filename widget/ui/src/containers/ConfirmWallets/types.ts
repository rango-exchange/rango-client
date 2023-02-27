import { WalletType } from '@rangodev/wallets-shared';

export interface SelectableWallet {
  chain: string;
  walletType: WalletType;
  address: string;
  image: string;
  selected: boolean;
  name: string;
}
