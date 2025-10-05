import type { SelectedWallet } from '../../store/slices/wallets';

export type PropTypes = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  warnings: {
    selectedWallet: SelectedWallet & { image: string };
    requiredBalance: string;
    userBalance: string;
  }[];
};
