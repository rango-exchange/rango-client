import type { NeedsNamespacesState } from '../../hooks/useStatefulConnect';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';
import type { BlockchainMeta } from 'rango-types';

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
    notSupported?: boolean;
  };
  checked: boolean;
  walletSupportedChains: BlockchainMeta[];
  showAsNetwork: boolean;
};
