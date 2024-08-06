import type { NeedsDerivationPathState } from '../../hooks/useStatefulConnect';

export interface PropTypes {
  value: NeedsDerivationPathState;
  onConfirm: (path: string) => void;
}
