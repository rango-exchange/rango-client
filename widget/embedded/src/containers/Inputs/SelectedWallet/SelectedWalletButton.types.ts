import type { ConnectedWallet } from '../../../store/slices/wallets';

export type PropTypes = {
  onClickWallet: () => void;
  relatedWallet?: ConnectedWallet & { image?: string };
};
