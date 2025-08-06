import type {
  CustomDestination,
  SelectedWallet,
} from '../../store/slices/wallets';

export type PropTypes = {
  label: string;
  onClickWallet: () => void;
  relatedWallet?: (SelectedWallet | CustomDestination) & { image?: string };
};
