import type { Namespace } from '@rango-dev/wallets-shared';

export interface PropTypes {
  selectedNamespace?: Namespace;
  type?: string;
  image?: string;
  onClose: () => void;
  onConfirm: (path: string) => void;
}
