import type { NeedsNamespacesState } from '../../hooks/useStatefulConnect';
import type { ExtendedModalWalletInfo } from '../../utils/wallets';
import type { LegacyNamespaceMeta } from '@rango-dev/wallets-core/legacy';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';

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
  targetWallet: ExtendedModalWalletInfo;
  initialConnect?: boolean;
  namespace: LegacyNamespaceMeta;
  navigateToDerivationPath: () => void;
  derivationPath?: string;
  singleSelection?: boolean;
};

export type NamespaceUnsupportedItemPropTypes = {
  namespace: LegacyNamespaceMeta;
};
