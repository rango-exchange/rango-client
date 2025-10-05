export type PropTypes = {
  open: boolean;
  tokenSymbol: string;
  onClose: () => void;
  onConfirm: () => void;
  onChangeWallet?: () => void;
};
