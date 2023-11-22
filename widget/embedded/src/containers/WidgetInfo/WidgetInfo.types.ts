import type { ConnectedWallet } from '../../store/wallets';
import type { Wallet } from '../../types';
import type { PendingSwapWithQueueID } from '@rango-dev/queue-manager-rango-preset';
import type { Token } from 'rango-sdk';

export interface WidgetInfoContextInterface {
  swaps: PendingSwapWithQueueID[];
  wallets: {
    details: ConnectedWallet[];
    totalBalance: string;
    isLoading: boolean;
    refetch: (accounts: Wallet[], tokens: Token[]) => void;
  };
}
