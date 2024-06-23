import type { DerivationPath } from '@rango-dev/wallets-shared';

export interface PropTypes {
  open: boolean;
  type?: string;
  image?: string;
  derivationPaths?: DerivationPath[];
  onClose: () => void;
  onConfirm: (path: string) => void;
}
