import type { Warning } from './InsufficientFeeWarning.types';

export type PropTypes = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  warnings: Warning[];
};
