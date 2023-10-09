import type { WalletState } from '@rango-dev/ui';

export interface PropTypes {
  open: boolean;
  onClose: () => void;
  image: string;
  state: WalletState;
  error?: string;
}

export type ModalContentProps = Pick<PropTypes, 'state' | 'error' | 'image'>;
