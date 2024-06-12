import type { Namespaces } from '@rango-dev/wallets-core';

export interface PropTypes {
  open: boolean;
  image?: string;
  onClose: () => void;
  onConfirm: (namespaces: Namespaces[]) => void;
  namespaces?: Namespaces[];
  singleNamespace?: boolean;
}
