import type { ChainTypes } from '@rango-dev/wallets-shared';

export interface PropTypes {
  open: boolean;
  onClose: () => void;
  onConfirm: (chainTypes: ChainTypes[]) => void;
  selectedWalletType: string;
  selectedWalletImage: string;
  requiredChainType?: null | ChainTypes;
}
