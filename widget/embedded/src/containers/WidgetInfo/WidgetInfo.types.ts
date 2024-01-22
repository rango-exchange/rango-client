import type { WidgetHistory } from './WidgetInfo.helpers';
import type { FetchStatus } from '../../store/slices/data';
import type { ConnectedWallet } from '../../store/wallets';
import type { Wallet } from '../../types';
import type { Notification } from '../../types/notification';
import type { BlockchainMeta, SwapperMeta, Token } from 'rango-sdk';

export interface WidgetInfoContextInterface {
  isActiveTab: boolean;
  setCurrentTabAsActive: () => void;
  history: WidgetHistory;
  wallets: {
    details: ConnectedWallet[];
    totalBalance: string;
    isLoading: boolean;
    refetch: (accounts: Wallet[], tokens: Token[]) => void;
  };
  meta: {
    blockchains: BlockchainMeta[];
    tokens: Token[];
    swappers: SwapperMeta[];
    loadingStatus: FetchStatus;
  };
  resetLanguage: () => void;
  notifications: {
    list: Notification[];
  };
}
