import { Network, WalletType } from '@rango-dev/wallets-shared';
import {
  CosmosTransaction,
  EvmBlockchainMeta,
  EvmTransaction,
  SimulationResult,
  SolanaTransaction,
  StarknetTransaction,
  TronTransaction,
  Transfer as TransferTransaction,
  AmountRestrictionType,
  BestRouteResponse,
  MetaResponse,
  Token,
  SwapResult,
} from 'rango-sdk';

import { PrettyError } from './shared-errors';
import BigNumber from 'bignumber.js';
import { numberToString } from './numbers';

export interface PendingSwapWithQueueID {
  id: string;
  swap: PendingSwap;
}

export type SwapProgressNotification = {
  eventType: EventType;
  swap: PendingSwap | null;
  step: PendingSwapStep | null;
};

export type WalletBalance = {
  chain: Network;
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
  | 'confirm_approve_contract'
  | 'contract_rejected'
  | 'check_tx_status'
  | 'check_approve_tx_status'
  | 'transfer_rejected'
  | 'transfer_failed'
  | 'calling_smart_contract'
  | 'smart_contract_called'
  | 'smart_contract_call_failed'
  | 'step_completed_with_output'
  | 'waiting_for_network_change'
  | 'waiting_for_connecting_wallet'
  | 'waiting_for_change_wallet_account'
  | 'network_changed'
  | 'not_enough_balance'
  | 'waiting_for_queue'
  | 'check_fee_failed'
  | 'route_failed_to_find'
  | 'transaction_expired';

export type SwapSavedSettings = {
  slippage: string;
  disabledSwappersIds?: string[];
  disabledSwappersGroups?: string[];
  infiniteApprove?: boolean;
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

export type StepStatus =
  | 'created'
  | 'running'
  | 'failed'
  | 'success'
  | 'waitingForApproval'
  | 'approved';

export type PendingSwapStep = {
  // routing data
  id: number;
  fromBlockchain: string;
  fromSymbol: string;
  fromSymbolAddress: string | null;
  fromDecimals: number;
  fromAmountPrecision: string | null;
  fromAmountMinValue: string | null;
  fromAmountMaxValue: string | null;
  fromAmountRestrictionType: AmountRestrictionType | null;
  fromLogo: string;
  toBlockchain: string;
  toSymbol: string;
  toSymbolAddress: string | null;
  toDecimals: number;
  toLogo: string;
  swapperId: string;
  expectedOutputAmountHumanReadable: string | null;
  startTransactionTime: number;
  internalSteps: SwapperStatusStep[] | null;
  estimatedTimeInSeconds: number | null;

  // status data
  status: StepStatus;
  networkStatus: PendingSwapNetworkStatus | null;
  executedTransactionId: string | null;
  executedTransactionTime: string | null;
  explorerUrl: SwapExplorerUrl[] | null;
  diagnosisUrl: string | null;
  outputAmount: string | null;

  // txs data
  cosmosTransaction: CosmosTransaction | null;
  transferTransaction: TransferTransaction | null;
  solanaTransaction: SolanaTransaction | null;
  evmApprovalTransaction: EvmTransaction | null;
  evmTransaction: EvmTransaction | null;
  tronApprovalTransaction: TronTransaction | null;
  tronTransaction: TronTransaction | null;
  starknetApprovalTransaction: StarknetTransaction | null;
  starknetTransaction: StarknetTransaction | null;

  // missing fields in older versions
  // keeping null for backward compatability
  swapperLogo: string | null;
  swapperType: string | null;
  fromBlockchainLogo: string | null;
  toBlockchainLogo: string | null;
  feeInUsd: string | null;
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
  hasAlreadyProceededToSign?: boolean | null;
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

export const getStarknetApproveUrl = (tx: string): string => {
  return 'https://starkscan.co/tx/{txHash}'.replace(
    '{txHash}',
    tx.toLowerCase()
  );
};

export const getTronApproveUrl = (tx: string): string => {
  return 'https://tronscan.org/#/transaction/{txHash}'.replace(
    '{txHash}',
    tx.toLowerCase()
  );
};

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

/**
 * Returns the wallet address, based on the current step of `PendingSwap`.
 */
export const getCurrentAddressOf = (
  swap: PendingSwap,
  step: PendingSwapStep
): string => {
  const result =
    swap.wallets[step.evmTransaction?.blockChain || ''] ||
    swap.wallets[step.evmApprovalTransaction?.blockChain || ''] ||
    swap.wallets[step.tronTransaction?.blockChain || ''] ||
    swap.wallets[step.tronApprovalTransaction?.blockChain || ''] ||
    swap.wallets[step.starknetTransaction?.blockChain || ''] ||
    swap.wallets[step.starknetApprovalTransaction?.blockChain || ''] ||
    swap.wallets[step.cosmosTransaction?.blockChain || ''] ||
    swap.wallets[step.solanaTransaction?.blockChain || ''] ||
    (step.transferTransaction?.fromWalletAddress
      ? { address: step.transferTransaction?.fromWalletAddress }
      : null) ||
    null;
  if (result == null) throw PrettyError.WalletMissing();
  return result.address;
};

export function getRelatedWallet(
  swap: PendingSwap,
  currentStep: PendingSwapStep
): WalletTypeAndAddress {
  const walletAddress = getCurrentAddressOf(swap, currentStep);
  const walletKV =
    Object.keys(swap.wallets)
      .map((k) => ({ k, v: swap.wallets[k] }))
      .find(({ v }) => v.address === walletAddress) || null;
  const blockchain = walletKV?.k || null;
  const wallet = walletKV?.v || null;

  const walletType = wallet?.walletType;
  if (wallet === null)
    throw PrettyError.AssertionFailed(
      `Wallet for source ${blockchain} not passed: walletType: ${walletType}`
    );
  return wallet;
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

export const getUsdPrice = (
  blockchain: string,
  symbol: string,
  address: string | null,
  allTokens: Token[]
): number | null => {
  const token = allTokens?.find(
    (t) =>
      t.blockchain === blockchain &&
      t.symbol?.toUpperCase() === symbol?.toUpperCase() &&
      t.address === address
  );
  return token?.usdPrice || null;
};

export function getUsdFeeOfStep(
  step: SwapResult,
  allTokens: Token[]
): BigNumber {
  let totalFeeInUsd = new BigNumber(0);
  for (let i = 0; i < step.fee.length; i++) {
    const fee = step.fee[i];
    if (fee.expenseType === 'DECREASE_FROM_OUTPUT') continue;

    const unitPrice = getUsdPrice(
      fee.asset.blockchain,
      fee.asset.symbol,
      fee.asset.address,
      allTokens
    );
    totalFeeInUsd = totalFeeInUsd.plus(
      new BigNumber(fee.amount).multipliedBy(unitPrice || 0)
    );
  }

  return totalFeeInUsd;
}

export function calculatePendingSwap(
  inputAmount: string,
  bestRoute: BestRouteResponse,
  wallets: { [p: string]: WalletTypeAndAddress },
  settings: SwapSavedSettings,
  validateBalanceOrFee: boolean,
  meta: MetaResponse | null
): PendingSwap {
  const simulationResult = bestRoute.result;
  if (!simulationResult) throw Error('Simulation result should not be null');

  return {
    creationTime: new Date().getTime().toString(),
    finishTime: null,
    requestId: bestRoute.requestId || '',
    inputAmount: inputAmount,
    wallets,
    status: 'running',
    isPaused: false,
    extraMessage: null,
    extraMessageSeverity: null,
    extraMessageDetail: null,
    extraMessageErrorCode: null,
    networkStatusExtraMessage: null,
    networkStatusExtraMessageDetail: null,
    lastNotificationTime: null,
    settings: settings,
    simulationResult: simulationResult,
    validateBalanceOrFee,
    steps:
      bestRoute.result?.swaps?.map((swap, index) => {
        return {
          id: index + 1,

          // from
          fromBlockchain: swap.from.blockchain,
          fromBlockchainLogo: swap.from.blockchainLogo,
          fromLogo: swap.from.logo,
          fromSymbol: swap.from.symbol,
          fromSymbolAddress: swap.from.address,
          fromDecimals: swap.from.decimals,
          fromAmountPrecision: swap.fromAmountPrecision,
          fromAmountMinValue: swap.fromAmountMinValue,
          fromAmountMaxValue: swap.fromAmountMaxValue,
          fromAmountRestrictionType: swap.fromAmountRestrictionType,

          // to
          toBlockchain: swap.to.blockchain,
          toBlockchainLogo: swap.to.blockchainLogo,
          toSymbol: swap.to.symbol,
          toSymbolAddress: swap.to.address,
          toDecimals: swap.to.decimals,
          toLogo: swap.to.logo,

          // swapper
          swapperId: swap.swapperId,
          swapperLogo: swap.swapperLogo,
          swapperType: swap.swapperType,

          // output, fee, timing
          expectedOutputAmountHumanReadable: swap.toAmount,
          outputAmount: '',
          feeInUsd: meta
            ? numberToString(getUsdFeeOfStep(swap, meta?.tokens), null, 8)
            : null,
          estimatedTimeInSeconds: swap.estimatedTimeInSeconds || null,

          // status, tracking
          status: 'created',
          networkStatus: null,
          startTransactionTime: new Date().getTime(),
          externalTransactionId: null,
          executedTransactionId: null,
          executedTransactionTime: null,
          explorerUrl: null,
          diagnosisUrl: null,
          trackingCode: null,
          internalSteps: null,

          // transactions
          evmTransaction: null,
          evmApprovalTransaction: null,
          starknetTransaction: null,
          starknetApprovalTransaction: null,
          tronTransaction: null,
          tronApprovalTransaction: null,
          cosmosTransaction: null,
          solanaTransaction: null,
          transferTransaction: null,

          // front fields
          hasAlreadyProceededToSign: false,
        };
      }) || [],
  };
}
