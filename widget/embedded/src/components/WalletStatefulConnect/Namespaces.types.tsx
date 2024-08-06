import type { NeedsNamespacesState } from '../../hooks/useStatefulConnect';
import type { Namespace } from '@rango-dev/wallets-shared';

export interface PropTypes {
  onConfirm: (namespaces: Namespace[]) => void;
  value: NeedsNamespacesState;
}
