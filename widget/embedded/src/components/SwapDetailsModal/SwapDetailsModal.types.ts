import type { PendingSwapNetworkStatus } from '@rango-dev/queue-manager-rango-preset';
import type { WalletType } from '@rango-dev/wallets-shared';

export type ModalState =
  | Exclude<PendingSwapNetworkStatus, PendingSwapNetworkStatus.WaitingForQueue>
  | 'delete'
  | 'cancel'
  | null;
type WalletTypeAndAddress = {
  walletType: WalletType;
  address: string;
};
export interface ModalPropTypes {
  onClose: () => void;
  onCancel: () => void;
  onDelete: () => void;
  state: ModalState;
  currentStepWallet: WalletTypeAndAddress | null;
  message: string;
}

export interface CompleteModalPropTypes {
  open: boolean;
  onClose: () => void;
  status: 'success' | 'failed';
  priceValue: string;
  usdValue: string;
  percentageChange: string;
  chain: {
    displayName?: string;
    image: string;
  };
  token: {
    displayName: string;
    image: string;
  };
  description?: string;
  diagnosisUrl?: string | null;
}

export interface ModalNetworkValueTypes {
  type: 'loading' | 'warning' | 'success';
  title: string;
}

export interface WalletStateContentProps extends ModalNetworkValueTypes {
  currentStepWallet: WalletTypeAndAddress | null;
  message: string;
  showWalletButton: boolean;
}

export type CancelContentProps = Pick<ModalPropTypes, 'onClose' | 'onCancel'>;

export type DeleteContentProps = Pick<ModalPropTypes, 'onClose' | 'onDelete'>;
