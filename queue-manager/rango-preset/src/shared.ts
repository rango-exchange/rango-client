import type { Network, WalletType } from '@rango-dev/wallets-shared';
import type {
  BestRouteResponse,
  BlockchainMeta,
  MetaResponse,
  SwapResult,
  Token,
} from 'rango-sdk';
import type {
  PendingSwap,
  PendingSwapStep,
  SwapSavedSettings,
  SwapStepRoute,
  WalletTypeAndAddress,
} from 'rango-types';

import BigNumber from 'bignumber.js';
import {
  isCosmosBlockchain,
  isEvmBlockchain,
  isStarknetBlockchain,
  isTronBlockchain,
} from 'rango-types';

import { numberToString } from './numbers';
import { PrettyError } from './shared-errors';

export interface PendingSwapWithQueueID {
  id: string;
  swap: PendingSwap;
}

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
  | 'not_enough_approval'
  | 'waiting_for_queue'
  | 'check_fee_failed'
  | 'route_failed_to_find'
  | 'transaction_expired';

export enum MessageSeverity {
  error = 'error',
  warning = 'warning',
  info = 'info',
  success = 'success',
}

export type SwapStatus = 'running' | 'failed' | 'success';

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
    step.solanaTransaction?.blockChain ||
    step.tonTransaction?.blockChain;
  if (b1) {
    return b1;
  }

  const transferAddress = step.transferTransaction?.fromWalletAddress;
  if (!transferAddress) {
    throw PrettyError.BlockchainMissing();
  }

  const blockchain =
    Object.keys(swap.wallets).find(
      (b) => swap.wallets[b]?.address === transferAddress
    ) || null;
  if (blockchain == null) {
    throw PrettyError.BlockchainMissing();
  }

  return blockchain;
};

const getBlockchainMetaExplorerBaseUrl = (
  blockchainMeta: BlockchainMeta
): string | undefined => {
  if (isCosmosBlockchain(blockchainMeta)) {
    return blockchainMeta.info?.explorerUrlToTx;
  } else if (
    isEvmBlockchain(blockchainMeta) ||
    isStarknetBlockchain(blockchainMeta) ||
    isTronBlockchain(blockchainMeta)
  ) {
    return blockchainMeta.info.transactionUrl;
  }
  return;
};

export const getScannerUrl = (
  txHash: string,
  network: Network,
  blockchainMetaMap: { [key: string]: BlockchainMeta }
): string | undefined => {
  const blockchainMeta = blockchainMetaMap[network];
  const baseUrl = getBlockchainMetaExplorerBaseUrl(blockchainMeta);
  if (!baseUrl) {
    return;
  }
  if (baseUrl.indexOf('/{txHash}') !== -1) {
    return baseUrl.replace('{txHash}', txHash?.toLowerCase());
  }
  return `${baseUrl}/${txHash?.toLowerCase()}`;
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
    swap.wallets[step.tonTransaction?.blockChain || ''] ||
    (step.transferTransaction?.fromWalletAddress
      ? { address: step.transferTransaction?.fromWalletAddress }
      : null) ||
    null;
  if (result == null) {
    throw PrettyError.WalletMissing();
  }
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
  if (wallet === null) {
    throw PrettyError.AssertionFailed(
      `Wallet for source ${blockchain} not passed: walletType: ${walletType}`
    );
  }
  return wallet;
}

export function getRelatedWalletOrNull(
  swap: PendingSwap,
  currentStep: PendingSwapStep | null
): WalletTypeAndAddress | null {
  if (!currentStep) {
    return null;
  }
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
    if (fee.expenseType === 'DECREASE_FROM_OUTPUT') {
      continue;
    }

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

function mapSwapStepToPendingSwapStep(
  swap: SwapResult,
  meta: Pick<MetaResponse, 'blockchains' | 'tokens'> | null
): SwapStepRoute {
  return {
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
    fromUsdPrice: swap.from.usdPrice,

    // to
    toBlockchain: swap.to.blockchain,
    toBlockchainLogo: swap.to.blockchainLogo,
    toSymbol: swap.to.symbol,
    toSymbolAddress: swap.to.address,
    toDecimals: swap.to.decimals,
    toLogo: swap.to.logo,
    toUsdPrice: swap.to.usdPrice,

    // swapper
    swapperId: swap.swapperId,
    swapperLogo: swap.swapperLogo,
    swapperType: swap.swapperType,

    // route
    expectedOutputAmountHumanReadable: swap.toAmount,
    feeInUsd: meta
      ? // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        numberToString(getUsdFeeOfStep(swap, meta?.tokens), null, 8)
      : null,
    estimatedTimeInSeconds: swap.estimatedTimeInSeconds || null,
    internalSteps: null,
  };
}

export function calculatePendingSwap(
  inputAmount: string,
  bestRoute: BestRouteResponse,
  wallets: { [p: string]: WalletTypeAndAddress },
  settings: SwapSavedSettings,
  validateBalanceOrFee: boolean,
  meta: Pick<MetaResponse, 'blockchains' | 'tokens'> | null
): PendingSwap {
  const simulationResult = bestRoute.result;
  if (!simulationResult) {
    throw Error('Simulation result should not be null');
  }

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
        const stepRoute = mapSwapStepToPendingSwapStep(swap, meta);
        return {
          id: index + 1,

          // route
          ...stepRoute,
          internalSwaps:
            swap?.internalSwaps?.map((internalSwap) => {
              const stepRoute = mapSwapStepToPendingSwapStep(
                internalSwap,
                meta
              );
              return stepRoute;
            }) || null,

          // status, tracking
          outputAmount: '',
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
          tonTransaction: null,

          // front fields
          hasAlreadyProceededToSign: false,
        };
      }) || [],
  };
}
