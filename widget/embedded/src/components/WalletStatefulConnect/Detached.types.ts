import type { NeedsNamespacesState } from '../../hooks/useStatefulConnect';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';

export interface PropTypes {
  value: NeedsNamespacesState;
  onConfirm: () => void;
  selectedNamespaces: Namespace[] | null;
}
