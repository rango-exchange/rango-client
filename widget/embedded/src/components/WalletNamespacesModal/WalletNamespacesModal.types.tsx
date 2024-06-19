import type { LegacyNamespace as Namespace } from '@rango-dev/wallets-core';

export interface PropTypes {
  open: boolean;
  image?: string;
  onClose: () => void;
  onConfirm: (namespaces: Namespace[]) => void;
  namespaces?: Namespace[];
  singleNamespace?: boolean;
}
