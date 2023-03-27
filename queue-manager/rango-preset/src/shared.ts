import {
  Network,
  Transaction,
  TransferTransaction,
  WalletError,
  WalletType,
} from '@rango-dev/wallets-shared';
import {
  CosmosTransaction,
  EvmBlockchainMeta,
  EvmTransaction,
  SimulationResult,
  SolanaTransaction,
  StarknetTransaction,
  TronTransaction,
} from 'rango-sdk';
import { BigNumber } from 'bignumber.js';

import { ErrorDetail, PrettyError } from './shared-errors';
import { getRelatedWallet } from './helpers';

export interface PendingSwapWithQueueID {
  id: string;
  swap: PendingSwap;
}

export type SwapperStatusResponse = {
  status: 'running' | 'failed' | 'success' | null;
  extraMessage: string | null;
  timestamp: number;
  outputAmount: BigNumber | null;
  explorerUrl: SwapExplorerUrl[] | null;
  trackingCode: string;
  newTx: Transaction | null;
  diagnosisUrl: string | null;
  steps: SwapperStatusStep[] | null;
};

export type SwapProgressNotification = {
  eventType: EventType;
  swap: PendingSwap | null;
  step: PendingSwapStep | null;
};

export type WalletBalance = {
  chain: Network | string;
  symbol: string;
  ticker: string;
  address: string | null;
  rawAmount: string;
  decimal: number | null;
  amount: string;
  logo: string | null;
  usdPrice: number | null;
};

export type Account = {
  balances: WalletBalance[] | null;
  address: string;
  loading: boolean;
  walletType: WalletType;
  error: boolean;
  explorerUrl: string | null;
  isConnected?: boolean;
};
export type Blockchain = { name: string; accounts: Account[] };
export type Wallet = { blockchains: Blockchain[] };

export type EventType =
  | 'swap_started'
  | 'confirm_contract'
  | 'confirm_transfer'
  | 'task_failed'
  | 'task_completed'
  | 'task_canceled'
  | 'task_paused'
  | 'contract_confirmed'
  | 'contract_rejected'
  | 'transfer_confirmed'
  | 'transfer_rejected'
  | 'calling_smart_contract'
  | 'smart_contract_called'
  | 'smart_contract_call_failed'
  | 'step_completed_with_output'
  | 'waiting_for_network_change'
  | 'waiting_for_connecting_wallet'
  | 'network_changed'
  | 'not_enough_balance'
  | 'check_fee_failed'
  | 'route_failed_to_find';

export type SwapSavedSettings = {
  slippage: string;
  disabledSwappersIds: string[];
  disabledSwappersGroups: string[];
  infiniteApprove: boolean;
};

type InternalStepState =
  | 'PENDING'
  | 'CREATED'
  | 'WAITING'
  | 'SIGNED'
  | 'SUCCESSED'
  | 'FAILED';

export type SwapperStatusStep = {
  name: string;
  state: InternalStepState;
  current: boolean;
};

export enum PendingSwapNetworkStatus {
  WaitingForConnectingWallet = 'waitingForConnectingWallet',
  WaitingForQueue = 'waitingForQueue',
  WaitingForNetworkChange = 'waitingForNetworkChange',
  NetworkChanged = 'networkChanged',
}

export type SwapExplorerUrl = {
  url: string;
  description: string | null;
};

export type SwapperId =
  | 'ThorChain'
  | 'OneInchEth'
  | 'Binance Bridge'
  | 'OneInchBsc'
  | 'OneInchPolygon'
  | 'Terra Bridge'
  | 'TerraSwap'
  | 'Osmosis'
  | 'Lido'
  | 'PoS Bridge'
  | 'Wormhole';

export type StepStatus =
  | 'created'
  | 'running'
  | 'failed'
  | 'success'
  | 'waitingForApproval'
  | 'approved';

export type PendingSwapStep = {
  id: number;
  fromBlockchain: Network;
  fromSymbol: string;
  fromSymbolAddress: string | null;
  fromDecimals: number;
  fromAmountPrecision: number | null;
  fromAmountMinValue: number | null;
  fromAmountMaxValue: number | null;
  fromLogo: string;
  toBlockchain: string;
  toSymbol: string;
  toSymbolAddress: string | null;
  toDecimals: number;
  toLogo: string;
  swapperId: SwapperId;
  expectedOutputAmountHumanReadable: string | null;
  startTransactionTime: number;
  outputAmount: string | null;
  status: StepStatus;
  networkStatus: PendingSwapNetworkStatus | null;
  executedTransactionId: string | null;
  explorerUrl: SwapExplorerUrl[] | null;
  evmApprovalTransaction: EvmTransaction | null;
  evmTransaction: EvmTransaction | null;
  cosmosTransaction: CosmosTransaction | null;
  transferTransaction: TransferTransaction | null;
  solanaTransaction: SolanaTransaction | null;
  starknetTransaction: StarknetTransaction | null;
  starknetApprovalTransaction: StarknetTransaction | null;
  tronTransaction: TronTransaction | null;
  tronApprovalTransaction: TronTransaction | null;
  diagnosisUrl: string | null;
  internalSteps: SwapperStatusStep[] | null;
};

export type WalletTypeAndAddress = {
  walletType: WalletType;
  address: string;
};

export enum MessageSeverity {
  error = 'error',
  warning = 'warning',
  info = 'info',
  success = 'success',
}

export type SwapStatus = 'running' | 'failed' | 'success';

export type PendingSwap = {
  creationTime: string;
  finishTime: string | null;
  requestId: string;
  inputAmount: string;
  status: SwapStatus;
  isPaused: boolean;
  extraMessage: string | null;
  extraMessageSeverity: MessageSeverity | null;
  extraMessageErrorCode: string | null;
  extraMessageDetail: string | null | undefined;
  networkStatusExtraMessage: string | null;
  networkStatusExtraMessageDetail: string | null;
  lastNotificationTime: string | null;
  wallets: { [p: string]: WalletTypeAndAddress };
  settings: SwapSavedSettings;
  steps: PendingSwapStep[];
  simulationResult: SimulationResult;
  validateBalanceOrFee: boolean;
};

export const getCurrentBlockchainOfOrNull = (
  swap: PendingSwap,
  step: PendingSwapStep
): Network | null => {
  try {
    return getCurrentBlockchainOf(swap, step);
  } catch (e) {
    return null;
  }
};

export const getCurrentBlockchainOf = (
  swap: PendingSwap,
  step: PendingSwapStep
): Network => {
  const b1 =
    step.evmTransaction?.blockChain ||
    step.evmApprovalTransaction?.blockChain ||
    step.starknetTransaction?.blockChain ||
    step.starknetApprovalTransaction?.blockChain ||
    step.tronTransaction?.blockChain ||
    step.tronApprovalTransaction?.blockChain ||
    step.cosmosTransaction?.blockChain ||
    step.solanaTransaction?.blockChain;
  if (!!b1) return b1 as Network;

  const transferAddress = step.transferTransaction?.fromWalletAddress;
  if (!transferAddress) throw PrettyError.BlockchainMissing();

  const blockchain =
    Object.keys(swap.wallets).find(
      (b) => swap.wallets[b]?.address === transferAddress
    ) || null;
  if (blockchain == null) throw PrettyError.BlockchainMissing();

  // TODO: check why it returns string
  return blockchain as Network;
};

export const getEvmApproveUrl = (
  tx: string,
  network: Network,
  evmBasedBlockchains: EvmBlockchainMeta[]
): string => {
  const evmBlochain = evmBasedBlockchains.find(
    (blockchain) => blockchain.name === network
  );

  if (!evmBlochain) {
    throw Error(`unsupported network: ${network} for getting approve url.`);
  }

  if (evmBlochain.info.transactionUrl)
    return evmBlochain.info.transactionUrl.replace(
      '{txHash}',
      tx.toLowerCase()
    );

  throw Error(`Explorer url for ${network} is not implemented`);
};

export const prettifyErrorMessage = (obj: unknown): ErrorDetail => {
  if (!obj) return { extraMessage: '', extraMessageErrorCode: null };
  if (obj instanceof PrettyError) return obj.getErrorDetail();
  if (obj instanceof WalletError) {
    const t = obj.getErrorDetail();
    return {
      extraMessage: t.message,
      extraMessageDetail: t.detail,
      extraMessageErrorCode: t.code,
    };
  }
  if (obj instanceof Error)
    return {
      extraMessage: obj.toString(),
      extraMessageErrorCode: null,
    };
  if (typeof obj !== 'string')
    return {
      extraMessage: JSON.stringify(obj),
      extraMessageErrorCode: null,
    };
  return { extraMessage: obj, extraMessageErrorCode: null };
};

export function getCookieId(): string {
  const key = 'X-Rango-Id';
  const cookieId = window.localStorage.getItem(key);
  if (cookieId) {
    return cookieId;
  }
  const value =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  window.localStorage.setItem(key, value);
  return value;
}

export function getNextStep(
  swap: PendingSwap,
  currentStep: PendingSwapStep
): PendingSwapStep | null {
  return (
    swap.steps.find(
      (step) =>
        step.status !== 'failed' &&
        step.status !== 'success' &&
        step.id !== currentStep.id
    ) || null
  );
}

export function getRelatedWalletOrNull(
  swap: PendingSwap,
  currentStep: PendingSwapStep
): WalletTypeAndAddress | null {
  try {
    return getRelatedWallet(swap, currentStep);
  } catch (e) {
    return null;
  }
}
