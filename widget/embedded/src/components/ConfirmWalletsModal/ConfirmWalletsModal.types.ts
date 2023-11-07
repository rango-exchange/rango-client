import type { ConfirmSwap } from '../../hooks/useConfirmSwap';

export type PropTypes = {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  onCheckBalance: ConfirmSwap['fetch'];
  loading: boolean;
};
