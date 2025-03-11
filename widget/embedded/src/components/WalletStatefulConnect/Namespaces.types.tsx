import type { NeedsNamespacesState } from '../../hooks/useStatefulConnect';
import type {
  Chain,
  Namespace,
} from '@rango-dev/wallets-core/namespaces/common';

export interface PropTypes {
  onConfirm: (namespaces: Namespace[]) => void;
  value: NeedsNamespacesState;
}

export type NamespaceItemPropTypes = (
  | { type: 'radio' }
  | { type: 'checkbox'; value: boolean }
) & {
  onClick: () => void;
  type: 'radio' | 'checkbox';
  namespace: {
    label: string;
    id: string;
    value: Namespace;
    chains: Chain[];
    unsupported?: boolean;
  };
};
