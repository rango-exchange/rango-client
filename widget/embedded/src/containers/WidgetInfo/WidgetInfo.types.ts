import type { WidgetHistory } from './WidgetInfo.helpers';
import type { FetchStatus } from '../../store/slices/data';
import type { ConnectedWallet } from '../../store/wallets';
import type { Wallet } from '../../types';
import type { BlockchainMeta, SwapperMeta, Token } from 'rango-sdk';

export interface WidgetInfoContextInterface {
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
}
