import type { NeedsNamespacesState } from '../../hooks/useStatefulConnect';
import type { LegacyNamespaceMeta } from '@arlert-dev/wallets-core/legacy';
import type { Namespace } from '@arlert-dev/wallets-core/namespaces/common';

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
  walletType: string;
  initialConnect?: boolean;
  namespace: LegacyNamespaceMeta;
};
