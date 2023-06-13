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

  // Dynamically will be added to context.
  claimedBy?: string;
  resetClaimedBy?: () => void;
}

export interface UseQueueManagerParams {
  lastConnectedWallet: string;
  disconnectedWallet: WalletType | undefined;
  clearDisconnectedWallet: () => void;
  evmChains: EvmBlockchainMeta[];
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

export enum RouteEventTypes {
  STARTED = 'started',
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
}

export enum StepEventTypes {
  STARTED = 'started',
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
  CREATE_TX = 'create_tx',
  SEND_TX = 'send_tx',
  TX_SENT = 'tx_sent',
  APPROVAL_TX_SUCCEEDED = 'approval_tx_succeeded',
  CHECK_TX = 'check_tx',
  OUTPUT_REVEALED = 'output_revealed',
  CANCELED = 'canceled',
  WAITING_FOR_QUEUE = 'waiting_for_queue',
  WAITING_FOR_WALLET_CONNECT = 'waiting_for_wallet_connect',
  WAITING_FOR_NETWORK_CHANGE = 'waiting_for_network_change',
  WAITING_FOR_CHANGE_WALLET_ACCOUNT = 'waiting_for_change_wallet_account',
}

export enum RouteExecutionMessageSeverity {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

type Event<
  T extends StepEventTypes | RouteEventTypes,
  U extends Record<string, unknown> = {}
> = {
  eventType: T;
  message: string;
  messageSeverity: RouteExecutionMessageSeverity;
} & U;

export type RouteEvent =
  | Event<RouteEventTypes.STARTED>
  | Event<RouteEventTypes.FAILED, { reason?: string }>
  | Event<RouteEventTypes.SUCCEEDED, { outputAmount: string }>;

export type StepEvent =
  | Event<StepEventTypes.STARTED>
  | Event<StepEventTypes.FAILED, { reason?: string }>
  | Event<StepEventTypes.SUCCEEDED, { outputAmount: string }>
  | Event<StepEventTypes.CREATE_TX>
  | Event<StepEventTypes.SEND_TX, { isApprovalTx: boolean }>
  | Event<StepEventTypes.TX_SENT, { isApprovalTx: boolean }>
  | Event<StepEventTypes.APPROVAL_TX_SUCCEEDED>
  | Event<StepEventTypes.CHECK_TX, { isApprovalTx: boolean }>
  | Event<StepEventTypes.OUTPUT_REVEALED>
  | Event<StepEventTypes.CANCELED>
  | Event<StepEventTypes.WAITING_FOR_QUEUE>
  | Event<StepEventTypes.WAITING_FOR_WALLET_CONNECT>
  | Event<StepEventTypes.WAITING_FOR_NETWORK_CHANGE>
  | Event<StepEventTypes.WAITING_FOR_CHANGE_WALLET_ACCOUNT>;

export type RouteExecutionEvents = {
  [MainEvents.RouteEvent]: { route: Route; event: RouteEvent };
  [MainEvents.StepEvent]: { route: Route; step: Step; event: StepEvent };
};
