import type { ConnectedWallet } from '../../store/slices/wallets';

export type PropTypes = {
  label: string;
  onClickWallet: () => void;
  relatedWallet?: ConnectedWallet & { image?: string };
};
