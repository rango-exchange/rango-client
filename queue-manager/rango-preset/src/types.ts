import type { Wallet } from './shared';
import type {
  QueueContext,
  QueueDef,
  QueueStorage,
} from '@yeager-dev/queue-manager-core';
import type { ConnectResult } from '@yeager-dev/wallets-core';
import type {
  Meta,
  Network,
  Providers,
  WalletState,
  WalletType,
} from '@yeager-dev/wallets-shared';
import type { Transaction } from 'rango-sdk';
import type {
  APIErrorCode,
  EvmBlockchainMeta,
  PendingSwap,
  PendingSwapStep,
  SignerFactory,
} from 'rango-types';

export type RemoveNameField<T, U extends string> = {
  [Property in keyof T as Exclude<Property, U>]: T[Property];
};

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

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
  ) => Promise<ConnectResult | undefined> | undefined;
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
> & { swapperName: string; transaction: Transaction | null };

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

export enum RouteEventType {
  STARTED = 'started',
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
}

export enum StepExecutionEventStatus {
  CREATE_TX = 'create_tx',
  SEND_TX = 'send_tx',
  TX_SENT = 'tx_sent',
}

export enum StepExecutionBlockedEventStatus {
  WAITING_FOR_QUEUE = 'waiting_for_queue',
  WAITING_FOR_WALLET_CONNECT = 'waiting_for_wallet_connect',
  WAITING_FOR_NETWORK_CHANGE = 'waiting_for_network_change',
  WAITING_FOR_CHANGE_WALLET_ACCOUNT = 'waiting_for_change_wallet_account',
}

export enum StepEventType {
  STARTED = 'started',
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
  TX_EXECUTION = 'tx_execution',
  TX_EXECUTION_BLOCKED = 'tx_execution_blocked',
  APPROVAL_TX_SUCCEEDED = 'approval_tx_succeeded',
  CHECK_STATUS = 'check_status',
  OUTPUT_REVEALED = 'output_revealed',
}

export enum EventSeverity {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

export type Event<
  T extends StepEventType | RouteEventType,
  U extends Record<string, unknown> = Record<string, unknown>
> = {
  type: T;
  message: string;
  messageSeverity: EventSeverity;
} & U;

export type FailedRouteEventPayload = {
  reason?: string;
  reasonCode: APIErrorCode;
};

export type FailedStepEventPayload = FailedRouteEventPayload;

export type SucceededRouteEventPayload = {
  outputAmount: string;
};

export type SucceededStepEventPayload = SucceededRouteEventPayload;

export type OutputRevealedEventPayload = SucceededRouteEventPayload;

export type StepExecutionEventPayload = {
  status:
    | StepExecutionEventStatus.CREATE_TX
    | StepExecutionEventStatus.SEND_TX
    | StepExecutionEventStatus.TX_SENT;
};

export type StepBlockedEventPayload =
  | { status: StepExecutionBlockedEventStatus.WAITING_FOR_QUEUE }
  | {
      status: StepExecutionBlockedEventStatus.WAITING_FOR_WALLET_CONNECT;
      requiredWallet?: string;
      requiredAccount?: string;
    }
  | {
      status: StepExecutionBlockedEventStatus.WAITING_FOR_CHANGE_WALLET_ACCOUNT;
      requiredAccount?: string;
    }
  | {
      status: StepExecutionBlockedEventStatus.WAITING_FOR_NETWORK_CHANGE;
      currentNetwork?: string;
      requiredNetwork?: string;
    };

export type RouteStartedEvent = Event<RouteEventType.STARTED>;

export type RouteFailedEvent = Event<
  RouteEventType.FAILED,
  FailedRouteEventPayload
>;

export type RouteSucceededEvent = Event<
  RouteEventType.SUCCEEDED,
  SucceededRouteEventPayload
>;

export type StepStartedEvent = Event<StepEventType.STARTED>;

export type StepSucceededEvent = Event<
  StepEventType.SUCCEEDED,
  SucceededStepEventPayload
>;
export type StepFailedEvent = Event<
  StepEventType.FAILED,
  FailedStepEventPayload
>;

export type StepTxExecutionUpdatedEvent = Event<
  StepEventType.TX_EXECUTION,
  StepExecutionEventPayload
>;

export type StepTxExecutionBlockedEvent = Event<
  StepEventType.TX_EXECUTION_BLOCKED,
  StepBlockedEventPayload
>;

export type StepCheckStatusEvent = Event<StepEventType.CHECK_STATUS>;

export type StepApprovalTxSucceededEvent =
  Event<StepEventType.APPROVAL_TX_SUCCEEDED>;

export type StepOutputRevealedEvent = Event<
  StepEventType.OUTPUT_REVEALED,
  OutputRevealedEventPayload
>;

export type StepEvent =
  | StepStartedEvent
  | StepSucceededEvent
  | StepFailedEvent
  | StepTxExecutionUpdatedEvent
  | StepTxExecutionBlockedEvent
  | StepCheckStatusEvent
  | StepApprovalTxSucceededEvent
  | StepOutputRevealedEvent;

export type RouteEvent =
  | RouteStartedEvent
  | RouteSucceededEvent
  | RouteFailedEvent;

export type RouteExecutionEvents = {
  [MainEvents.RouteEvent]: { route: Route; event: RouteEvent };
  [MainEvents.StepEvent]: { route: Route; step: Step; event: StepEvent };
};
