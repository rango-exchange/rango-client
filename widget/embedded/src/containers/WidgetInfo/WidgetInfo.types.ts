import type { WidgetHistory } from './WidgetInfo.helpers';
import type { ConnectedWallet } from '../../store/wallets';
import type { Wallet } from '../../types';
import type { Token } from 'rango-sdk';

export interface WidgetInfoContextInterface {
  history: WidgetHistory;
  wallets: {
    details: ConnectedWallet[];
    totalBalance: string;
    isLoading: boolean;
    refetch: (accounts: Wallet[], tokens: Token[]) => void;
  };
}
