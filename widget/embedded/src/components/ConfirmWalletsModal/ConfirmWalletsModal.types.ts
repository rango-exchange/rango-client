import type { ConfirmSwap } from '../../hooks/useConfirmSwap/useConfirmSwap.types';

export type PropTypes = {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  onCheckBalance: ConfirmSwap['fetch'];
  loading: boolean;
};
