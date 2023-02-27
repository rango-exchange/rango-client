import { WalletType } from '@rango-dev/wallets-shared';
import { SelectableWallet } from '../../containers/ConfirmWallets/types';

export const data: SelectableWallet[] = [
  {
    blockchain: 'BSC',
    walletType: WalletType.META_MASK,
    address: '0x5423e28219d6d568dcf62a8134d623e6f4a1c2df',
    image: 'https://app.rango.exchange/wallets/metamask.svg',
    selected: true,
  },
];
