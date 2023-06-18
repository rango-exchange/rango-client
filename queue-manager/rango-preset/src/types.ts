import { QueueStorage, QueueDef } from '@rango-dev/queue-manager-core';
import { QueueContext } from '@rango-dev/queue-manager-core/dist/queue';
import { ConnectResult, Providers } from '@rango-dev/wallets-core';
import {
  Meta,
  Network,
  WalletState,
  WalletType,
} from '@rango-dev/wallets-shared';
import {
  PendingSwap,
  PendingSwapNetworkStatus,
  PendingSwapStep,
  SwapProgressNotification,
  Wallet,
} from './shared';
import { EvmBlockchainMeta, SignerFactory } from 'rango-types';

export type SwapQueueDef = QueueDef<
  SwapStorage,
  SwapActionTypes,
  SwapQueueContext
>;

export interface SwapStorage extends QueueStorage {
  swapDetails: PendingSwap;
}

export enum SwapActionTypes {
  START = 'START',
  SCHEDULE_NEXT_STEP = 'SCHEDULE_NEXT_STEP',
  CREATE_TRANSACTION = 'CREATE_TRANSACTION',
  EXECUTE_TRANSACTION = 'EXECUTE_TRANSACTION',
  CHECK_TRANSACTION_STATUS = 'CHECK_TRANSACTION_STATUS',
}

export type GetCurrentAddress = (
  type: WalletType,
  network: Network
) => string | undefined;

export enum BlockReason {
  WAIT_FOR_CONNECT_WALLET = 'waiting_for_connecting_wallet',
  WAIT_FOR_NETWORK_CHANGE = 'waiting_for_network_change',
  DEPENDS_ON_OTHER_QUEUES = 'depends_on_other_queues',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Block<T = any> {
  reason: BlockReason;
  description: string;
  details?: T;
}

export interface SwapQueueContext extends QueueContext {
  meta: Meta;
  wallets: Wallet | null;
  providers: Providers;
  getSigners: (type: WalletType) => SignerFactory;
  switchNetwork: (
    wallet: WalletType,
    network: Network
  ) => Promise<ConnectResult> | undefined;
  canSwitchNetworkTo: (type: WalletType, network: Network) => boolean;
  connect: (
    wallet: WalletType,
    network: Network
  ) => Promise<ConnectResult> | undefined;
  state: (type: WalletType) => WalletState;
  isMobileWallet: (type: WalletType) => boolean;
  notifier: (data: SwapProgressNotification) => void;

  // Dynamically will be added to context.
  claimedBy?: string;
  resetClaimedBy?: () => void;
}

export interface UseQueueManagerParams {
  lastConnectedWallet: string;
  disconnectedWallet: WalletType | undefined;
  clearDisconnectedWallet: () => void;
  evmChains: EvmBlockchainMeta[];
  notifier: SwapQueueContext['notifier'];
  canSwitchNetworkTo: (type: WalletType, network: Network) => boolean;
}

import {
  TransactionType,
  CosmosTransaction,
  EvmTransaction,
  SolanaTransaction,
  SwapperStatusStep,
  Transfer,
  StarknetTransaction,
  TronTransaction,
} from 'rango-sdk';

export enum MainEvents {
  RouteEvent = 'routeEvent',
  StepEvent = 'stepEvent',
}

export type Step = Pick<
  PendingSwapStep,
  | 'diagnosisUrl'
  | 'estimatedTimeInSeconds'
  | 'explorerUrl'
  | 'feeInUsd'
  | 'executedTransactionId'
  | 'executedTransactionTime'
  | 'expectedOutputAmountHumanReadable'
  | 'fromBlockchain'
  | 'toBlockchain'
  | 'fromSymbol'
  | 'toSymbol'
  | 'toSymbolAddress'
  | 'fromSymbolAddress'
  | 'swapperType'
  | 'outputAmount'
  | 'fromAmountMaxValue'
  | 'fromAmountMinValue'
  | 'fromAmountPrecision'
  | 'fromAmountRestrictionType'
  | 'fromDecimals'
  | 'status'
> & { swapperName: string } & (
    | { transactionType: null }
    | {
        transactionType: TransactionType.COSMOS;
        transaction: CosmosTransaction | null;
      }
    | {
        transactionType: TransactionType.EVM;
        transaction: EvmTransaction | null;
        approvalTransaction: EvmTransaction | null;
        networkStatus: PendingSwapNetworkStatus | null;
      }
    | {
        transactionType: TransactionType.SOLANA;
        transaction: SolanaTransaction | null;
        internalSteps: SwapperStatusStep[] | null;
      }
    | {
        transactionType: TransactionType.TRANSFER;
        transaction: Transfer | null;
      }
    | {
        transactionType: TransactionType.STARKNET;
        transaction: StarknetTransaction | null;
        approvalTransaction: StarknetTransaction | null;
      }
    | {
        transactionType: TransactionType.TRON;
        transaction: TronTransaction | null;
        approvalTransaction: TronTransaction | null;
      }
  );

export type Route = Pick<
  PendingSwap,
  | 'creationTime'
  | 'finishTime'
  | 'requestId'
  | 'inputAmount'
  | 'status'
  | 'wallets'
> & { steps: Step[]; slippage: string; infiniteApproval?: boolean };

export type SwapEvent = RouteEvent | StepEvent;

export type RouteEventType = 'started' | 'failed' | 'succeeded';
export type StepEventType =
  | RouteEventType
  | (
      | 'create_tx'
      | 'send_tx'
      | 'tx_sent'
      | 'approval_tx_succeeded'
      | 'check_tx'
      | 'output_revealed'
      | 'canceled'
      | 'waiting_for_queue'
      | 'waiting_for_wallet_connect'
      | 'waiting_for_network_change'
      | 'waiting_for_change_wallet_account'
    );

type Event<T extends StepEventType, U extends Record<string, unknown> = {}> = {
  eventType: T;
  message: string;
} & U;

export type RouteEvent =
  | Event<'started'>
  | Event<'failed', { reason?: string }>
  | Event<'succeeded', { outputAmount: string }>;

export type StepEvent =
  | RouteEvent
  | (
      | Event<'create_tx'>
      | Event<'send_tx', { isApprovalTx: boolean }>
      | Event<'tx_sent', { isApprovalTx: boolean }>
      | Event<'approval_tx_succeeded'>
      | Event<'check_tx', { isApprovalTx: boolean }>
      | Event<'output_revealed'>
      | Event<'canceled'>
      | Event<'waiting_for_queue'>
      | Event<'waiting_for_wallet_connect'>
      | Event<'waiting_for_network_change'>
      | Event<'waiting_for_change_wallet_account'>
    );

export type RouteExecutionEvents = {
  [MainEvents.RouteEvent]: { route: Route; event: RouteEvent };
  [MainEvents.StepEvent]: { route: Route; step: Step; event: StepEvent };
};
