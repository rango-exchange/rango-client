import type { Namespace } from '@rango-dev/wallets-shared';

export interface PropTypes {
  open: boolean;
  image?: string;
  onClose: () => void;
  onConfirm: (namespaces: Namespace[]) => void;
  availableNamespaces?: Namespace[];
  singleNamespace?: boolean;
}
