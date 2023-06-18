import { QueueStorage, QueueDef } from '@rango-dev/queue-manager-core';
import { QueueContext } from '@rango-dev/queue-manager-core/dist/queue';
import { ConnectResult, Providers } from '@rango-dev/wallets-core';
import {
  Meta,
  Network,
  WalletState,
  WalletType,
} from '@rango-dev/wallets-shared';
import { APIErrorCode, EvmBlockchainMeta, SignerFactory } from 'rango-types';
import { Transaction } from 'rango-sdk';
import { PendingSwap, PendingSwapStep, Wallet } from './shared';

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

export enum TX_EXECUTION {
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
  CREATE_TX = 'create_tx',
  SEND_TX = 'send_tx',
  TX_SENT = 'tx_sent',
}

export enum TX_EXECUTION_BLOCKED {
  WAITING_FOR_QUEUE = 'waiting_for_queue',
  WAITING_FOR_WALLET_CONNECT = 'waiting_for_wallet_connect',
  WAITING_FOR_NETWORK_CHANGE = 'waiting_for_network_change',
  WAITING_FOR_CHANGE_WALLET_ACCOUNT = 'waiting_for_change_wallet_account',
}

export enum StepEventType {
  STARTED = 'started',
  TX_EXECUTION = 'tx_execution',
  TX_EXECUTION_BLOCKED = 'tx_execution_blocked',
  APPROVAL_TX_SUCCEEDED = 'approval_tx_succeeded',
  CHECK_STATUS = 'check_status',
  OUTPUT_REVEALED = 'output_revealed',
}

export enum RouteExecutionMessageSeverity {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

type Event<
  T extends StepEventType | RouteEventType,
  U extends Record<string, unknown> = Record<string, unknown>
> = {
  eventType: T;
  message: string;
  messageSeverity: RouteExecutionMessageSeverity;
} & U;

type FailedEventPayload = {
  reason?: string;
  reasonCode: APIErrorCode;
};

export type RouteEvent =
  | Event<RouteEventType.STARTED>
  | Event<RouteEventType.FAILED, FailedEventPayload>
  | Event<RouteEventType.SUCCEEDED, { outputAmount: string }>;

export type StepEvent =
  | Event<StepEventType.STARTED>
  | Event<
      StepEventType.TX_EXECUTION,
      | {
          type: TX_EXECUTION.SUCCEEDED;
          outputAmount: string;
        }
      | ({
          type: TX_EXECUTION.FAILED;
        } & FailedEventPayload)
      | {
          type:
            | TX_EXECUTION.CREATE_TX
            | TX_EXECUTION.SEND_TX
            | TX_EXECUTION.TX_SENT;
        }
    >
  | Event<StepEventType.APPROVAL_TX_SUCCEEDED>
  | Event<StepEventType.CHECK_STATUS>
  | Event<StepEventType.OUTPUT_REVEALED, { outputAmount: string }>
  | Event<
      StepEventType.TX_EXECUTION_BLOCKED,
      | { type: TX_EXECUTION_BLOCKED.WAITING_FOR_QUEUE }
      | {
          type: TX_EXECUTION_BLOCKED.WAITING_FOR_WALLET_CONNECT;
          requiredWallet?: string;
          requiredAccount?: string;
        }
      | {
          type: TX_EXECUTION_BLOCKED.WAITING_FOR_CHANGE_WALLET_ACCOUNT;
          requiredAccount?: string;
        }
      | {
          type: TX_EXECUTION_BLOCKED.WAITING_FOR_NETWORK_CHANGE;
          currentNetwork?: string;
          requiredNetwork?: string;
        }
    >;

export type RouteExecutionEvents = {
  [MainEvents.RouteEvent]: { route: Route; event: RouteEvent };
  [MainEvents.StepEvent]: { route: Route; step: Step; event: StepEvent };
};
