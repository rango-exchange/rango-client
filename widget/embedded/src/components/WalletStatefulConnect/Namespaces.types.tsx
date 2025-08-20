import type { NeedsNamespacesState } from '../../hooks/useStatefulConnect';
import type { LegacyNamespaceMeta } from '@rango-dev/wallets-core/legacy';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';
import type { NamespaceData } from '@rango-dev/wallets-core/store';

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
