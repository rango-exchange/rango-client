import type { NeedsNamespacesState } from '../../hooks/useStatefulConnect';
import type { Namespace } from '@hub3js/namespaces';

export interface PropTypes {
  value: NeedsNamespacesState;
  onConfirm: () => void;
  confirmText?: string;
  onDisconnectWallet: () => void;
  selectedNamespaces:
    | { namespace: Namespace; derivationPath?: string }[]
    | null;
  navigateToDerivationPath: (selectedNamespace: Namespace) => void;
}
