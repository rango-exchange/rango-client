import { CosmosTransaction, EvmTransaction, SimulationResult, SolanaTransaction, SwapExplorerUrl, SwapperStatusStep, Transfer } from 'rango-sdk';
import {
  MessageSeverity,
  PendingSwapNetworkStatus,
  StepStatus,
  SwapSavedSettings,
  SwapStatus,
  WalletTypeAndAddress,
} from '../../types/swaps';

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
