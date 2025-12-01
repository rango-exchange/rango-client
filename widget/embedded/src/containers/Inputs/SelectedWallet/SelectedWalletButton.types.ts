import type { ConnectedWallet } from '../../../store/slices/wallets';

export type PropTypes = {
  onClickWallet: () => void;
  relatedWallet?:
    | Pick<ConnectedWallet, 'address' | 'chain'> & { image?: string };
};
