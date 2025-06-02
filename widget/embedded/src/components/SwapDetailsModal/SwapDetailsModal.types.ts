import type { TargetNamespace } from '@rango-dev/queue-manager-rango-preset';
import type { LegacyWalletType } from '@rango-dev/wallets-core/legacy';
import type { PendingSwap, PendingSwapNetworkStatus } from 'rango-types';

export type ModalState =
  | Exclude<PendingSwapNetworkStatus, PendingSwapNetworkStatus.WaitingForQueue>
  | 'delete'
  | 'cancel'
  | null;
export interface ModalPropTypes {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  onDelete: () => void;
  state: ModalState;
  swap: PendingSwap;
  message: string;
}

export interface CompleteModalPropTypes {
  open: boolean;
  onClose: () => void;
  status: 'success' | 'failed';
  priceValue: string;
  realValue: string;
  usdValue: string;
  realUsdValue: string;
  percentageChange: string;
  chain: {
    displayName?: string;
    image?: string;
  };
  token: {
    displayName: string;
    image?: string;
  };
  description?: React.ReactNode;
  diagnosisUrl?: string | null;
}

export interface WalletStateContentProps {
  swap: PendingSwap;
  message: string;
  onClose: () => void;
}

export interface NetworkStateContentProps {
  message: string;
  status: 'networkChanged' | 'waitingForNetworkChange';
}

export interface InstallWalletContentProps {
  walletType: LegacyWalletType;
}

export interface ConnectWalletContentProps {
  wallet: {
    walletType: LegacyWalletType;
    address: string;
    derivationPath?: string;
  };
  namespace: TargetNamespace | null;
  onClose: () => void;
}

export interface CancelContentProps {
  onCancel: () => void;
  onClose: () => void;
}

export interface DeleteContentProps {
  onDelete: () => void;
  onClose: () => void;
}
