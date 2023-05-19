import {
  CosmosTransaction,
  EvmTransaction,
  SolanaTransaction,
  SwapExplorerUrl,
  SwapperStatusStep,
  Transfer,
} from 'rango-sdk';
import { PendingSwapNetworkStatus, StepStatus } from '../../types/swaps';
export type { PendingSwap } from '@rango-dev/queue-manager-rango-preset';

export type PendingSwapStep = {
  id: number;
  fromBlockchain: string;
  fromSymbol: string;
  fromSymbolAddress: string | null;
  fromDecimals: number;
  fromAmountPrecision: string | null;
  fromAmountMinValue: string | null;
  fromAmountMaxValue: string | null;
  fromLogo: string;
  fromBlockchainLogo: string;
  toBlockchainLogo: string;
  toBlockchain: string;
  toSymbol: string;
  toSymbolAddress: string | null;
  toDecimals: number;
  toLogo: string;
  swapperId: string;
  swapperLogo: string;
  swapperType: string;
  feeInUsd: string;
  expectedOutputAmountHumanReadable: string | null;
  startTransactionTime: number;
  outputAmount: string;
  status: StepStatus;
  networkStatus: PendingSwapNetworkStatus | null;
  executedTransactionId: string | null;
  explorerUrl: SwapExplorerUrl[] | null;
  evmApprovalTransaction: EvmTransaction | null;
  evmTransaction: EvmTransaction | null;
  cosmosTransaction: CosmosTransaction | null;
  transferTransaction: Transfer | null;
  solanaTransaction: SolanaTransaction | null;
  diagnosisUrl: string | null;
  internalSteps: SwapperStatusStep[] | null;
};
