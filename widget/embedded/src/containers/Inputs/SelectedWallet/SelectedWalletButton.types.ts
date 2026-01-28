import type { ConnectedWallet } from '../../../store/slices/wallets';

export type PropTypes = {
  onClickWallet: () => void;
  disabled: boolean;
  relatedWallet?:
    | Pick<ConnectedWallet, 'address' | 'chain'> & { image?: string };
};
