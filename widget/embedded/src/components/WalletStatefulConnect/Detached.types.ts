import type { NeedsNamespacesState } from '../../hooks/useStatefulConnect';

export interface PropTypes {
  value: NeedsNamespacesState;
  onConfirm: () => void;
}
