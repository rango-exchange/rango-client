import type { WalletType } from '@rango-dev/wallets-shared';
import type { BlockchainMeta } from 'rango-sdk';

export type PropTypes = (
  | {
      type: 'Blockchains';
      value?: string[];
      list: BlockchainMeta[];
    }
  | {
      type: 'Wallets';
      value?: WalletType[];
    }
) & {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export interface MultiSelectChipProps {
  label: string;
  variant?: 'contained' | 'outlined';
}
