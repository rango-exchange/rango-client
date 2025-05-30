import type { WidgetHistory } from './WidgetInfo.helpers';
import type { FetchStatus, FindToken } from '../../store/slices/data';
import type { DeprecatedWalletDetail } from '../../store/slices/wallets';
import type { QuoteInputs, UpdateQuoteInputs, Wallet } from '../../types';
import type { Notification } from '../../types/notification';
import type { BlockchainMeta, SwapperMeta, Token } from 'rango-sdk';

export interface WidgetInfoContextInterface {
  isActiveTab: boolean;
  setCurrentTabAsActive: () => void;
  history: WidgetHistory;
  wallets: {
    details: DeprecatedWalletDetail[];
    totalBalance: string;
    isLoading: boolean;
    refetch: (accounts: Wallet[]) => void;
  };
  meta: {
    blockchains: BlockchainMeta[];
    tokens: Token[];
    swappers: SwapperMeta[];
    loadingStatus: FetchStatus;
    findToken: FindToken;
  };
  resetLanguage: () => void;
  notifications: {
    list: Notification[];
    clearAll: () => void;
  };
  quote: {
    quoteInputs: QuoteInputs;
    updateQuoteInputs: UpdateQuoteInputs;
  };
}
