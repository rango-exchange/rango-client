import type { NeedsNamespacesState } from '../../hooks/useStatefulConnect';
import type { Chain } from '@rango-dev/wallets-core/dist/chains/types';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';

export interface PropTypes {
  onConfirm: (namespaces: Namespace[]) => void;
  value: NeedsNamespacesState;
}

export type NamespaceItemPropTypes = {
  onClick: () => void;
  type: 'radio' | 'checkbox';
  namespace: {
    label: string;
    id: string;
    value: Namespace;
    chains: Chain[];
    unsupported?: boolean;
  };
  checked: boolean;
};
