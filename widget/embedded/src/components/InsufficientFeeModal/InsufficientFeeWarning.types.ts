import type { SelectedWallet } from '../../store/slices/wallets';

export type Warning = {
  selectedWallet: SelectedWallet & { image: string };
  requiredBalance: string;
  userBalance: string;
};

export type PropTypes = {
  warning: Warning;
};
