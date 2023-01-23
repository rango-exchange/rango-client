import {
  CosmosTransaction,
  EvmTransaction,
  MessageSeverity,
  PendingSwapNetworkStatus,
  SimulationResult,
  SolanaTransaction,
  StepStatus,
  SwapExplorerUrl,
  SwapperId,
  SwapperStatusStep,
  SwapSavedSettings,
  SwapStatus,
  TransferTransaction,
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
  swapperId: SwapperId;
  expectedOutputAmountHumanReadable: string | null;
  startTransactionTime: number;
  outputAmount: string;
  status: StepStatus;
  networkStatus: PendingSwapNetworkStatus | null;
  executedTransactionId: string | null;
  explorerUrl: SwapExplorerUrl[] | null;
  evmApprovalTransaction: EvmTransaction | null;
  evmTransaction: EvmTransaction | null;
  cosmosTransaction: any | CosmosTransaction | null;
  transferTransaction: TransferTransaction | null;
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
