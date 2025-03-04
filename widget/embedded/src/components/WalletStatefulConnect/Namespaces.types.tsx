import type { NeedsNamespacesState } from '../../hooks/useStatefulConnect';
import type { Chain } from '@rango-dev/wallets-core/dist/chains/types';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';

export interface PropTypes {
  onConfirm: (namespaces: Namespace[]) => void;
  value: NeedsNamespacesState;
}

export type NamespaceItemPropTypes = {
  onClick: () => void;
  singleSelect: boolean;
  namespace: {
    label: string;
    id: string;
    value: Namespace;
    networks: Chain[];
    notSupported?: boolean;
  };
  checked: boolean;
};

export type NamespaceDetachedItemPropTypes = {
  walletType: string;
  namespace: {
    label: string;
    id: string;
    value: Namespace;
    networks: Chain[];
    notSupported?: boolean;
  };
};
