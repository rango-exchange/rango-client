import type { NeedsNamespacesState } from '../../hooks/useStatefulConnect';
import type { NamespaceData } from '@hub3js/core/store';
import type { Namespace } from '@hub3js/namespaces';
import type { LegacyNamespaceMeta } from '@rango-dev/wallets-core/legacy';

export interface PropTypes {
  onConfirm: (namespaces: Namespace[]) => void;
  value: NeedsNamespacesState;
}

interface NamespaceItemSharedPropTypes {
  onClick: () => void;
  type: 'radio' | 'checkbox';
  namespace: LegacyNamespaceMeta;
}

interface RadioNamespaceItemPropTypes extends NamespaceItemSharedPropTypes {
  type: 'radio';
}

interface CheckboxNamespaceItemPropTypes extends NamespaceItemSharedPropTypes {
  type: 'checkbox';
  value: boolean;
}

export type NamespaceItemPropTypes =
  | RadioNamespaceItemPropTypes
  | CheckboxNamespaceItemPropTypes;

export type NamespaceDetachedItemPropTypes = {
  namespace: LegacyNamespaceMeta;
  state: NamespaceData;
  initialConnect?: boolean;
  disabled?: boolean;
  handleConnect: (options?: {
    shouldAskForDerivationPath?: boolean;
  }) => Promise<void>;
  handleDisconnect: () => Promise<void>;
};
