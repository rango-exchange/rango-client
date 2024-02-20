import type { getSwapMessages } from '../../utils/swap';
import type { ModalState } from '../SwapDetailsModal';
import type { ConnectResult } from '@rango-dev/wallets-react';
import type { SwapperMeta } from 'rango-sdk';
import type {
  BlockchainMeta,
  PendingSwap,
  PendingSwapNetworkStatus,
  PendingSwapStep,
} from 'rango-types';

export interface SwapAlertsProps extends WaningAlertsProps {
  step: PendingSwapStep;
  hasAlreadyProceededToSign?: boolean;
}

export interface WaningAlertsProps extends FailedAlertsProps {
  switchNetwork: (() => Promise<ConnectResult>) | undefined;
  showNetworkModal: PendingSwapNetworkStatus | null | undefined;
  setNetworkModal: (network: ModalState) => void;
}

export interface FailedAlertsProps {
  message: ReturnType<typeof getSwapMessages>;
}

export type GetStep = {
  swap: PendingSwap;
  blockchains: BlockchainMeta[];
  swappers: SwapperMeta[];
} & Omit<SwapAlertsProps, 'step' | 'hasAlreadyProceededToSign'>;
