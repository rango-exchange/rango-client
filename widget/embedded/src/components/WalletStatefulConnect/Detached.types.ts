import type { NeedsNamespacesState } from '../../hooks/useStatefulConnect';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';

export interface PropTypes {
  value: NeedsNamespacesState;
  onConfirm: () => void;
  onDisconnectWallet: () => void;
  selectedNamespaces:
    | { namespace: Namespace; derivationPath?: string }[]
    | null;
  navigateToDerivationPath: (selectedNamespace: Namespace) => void;
}
