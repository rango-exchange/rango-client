import type {
  Asset,
  CosmosTransaction,
  EvmTransaction,
  Network,
  SolanaTransaction,
  Transaction,
  TransferTransaction,
  WalletType,
} from '@yeager-dev/wallets-shared';
import type BigNumber from 'bignumber.js';

import { Networks } from '@yeager-dev/wallets-shared';

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

export type SwapSavedSettings = {
  slippage: string;
  disabledSwappersIds: string[];
  disabledSwappersGroups: string[];
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
  diagnosisUrl: string | null;
  internalSteps: SwapperStatusStep[] | null;
};

export type SwapResultAsset = {
  symbol: string;
  logo: string;
  address: string | null;
  blockchain: Network;
  decimals: number;
  usdPrice: number | null;
};

export type ExpenseType = 'FROM_SOURCE_WALLET' | 'DECREASE_FROM_OUTPUT';

export type SwapFee = {
  asset: Asset;
  amount: string;
  expenseType: ExpenseType;
};

export type TimeStat = {
  min: number;
  avg: number;
  max: number;
};

export type SwapNode = {
  marketName: string;
  marketId: string | null;
  percent: number;
};

export type SwapSuperNode = {
  nodes: SwapNode[];
  from: string;
  fromLogo: string;
  fromAddress: string | null;
  fromBlockchain: string;
  to: string;
  toLogo: string;
  toAddress: string | null;
  toBlockchain: string;
};

export type SwapRoute = {
  nodes: SwapSuperNode[] | null;
};

export type RecommendedSlippage = {
  error: boolean;
  slippage: string | null;
};

export type SwapResult = {
  swapperId: SwapperId;
  from: SwapResultAsset;
  to: SwapResultAsset;
  fromAmount: string;
  fromAmountPrecision: number | null;
  fromAmountRestrictionType: 'EXCLUSIVE' | 'INCLUSIVE';
  fromAmountMinValue: number | null;
  fromAmountMaxValue: number | null;
  toAmount: string;
  fee: SwapFee[];
  estimatedTimeInSeconds: number;
  timeStat: TimeStat | null;
  swapChainType: string;
  routes: SwapRoute[] | null;
  recommendedSlippage: RecommendedSlippage | null;
  includesDestinationTx: boolean | null | undefined;
};

export type SimulationResult = {
  outputAmount: string;
  swaps: SwapResult[];
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
export type Amount = { amount: string; decimals: number };
export type WalletRequiredAssetReason =
  | 'FEE'
  | 'INPUT_ASSET'
  | 'FEE_AND_INPUT_ASSET';

export type SimulationAssetAndAmount = {
  asset: Asset;
  requiredAmount: Amount;
  currentAmount: Amount;
  reason: WalletRequiredAssetReason;
  ok: boolean;
};

export type SimulationWallet = {
  address: string;
  validResult: boolean;
  requiredAssets: SimulationAssetAndAmount[];
  addressIsValid: boolean;
};

export type SimulationValidationStatus = {
  blockchain: string;
  wallets: SimulationWallet[];
};

export type BestRoute = {
  from: Asset;
  to: Asset;
  requestAmount: string;
  result: SimulationResult | null;
  validationStatus: SimulationValidationStatus[] | null;
  requestId: string;
  missingBlockchains: string[];
  diagnosisMessages: string[];
};

export const SWAPPER_ONE_INCH_ETH = 'OneInchEth';
export const SWAPPER_ONE_INCH_BSC = 'OneInchBsc';
export const SWAPPER_ONE_INCH_POLYGON = 'OneInchPolygon';
export const SWAPPER_TERRA_BRIDGE = 'Terra Bridge';
export const SWAPPER_LIDO = 'Lido';
export const SWAPPER_TERRA_SWAP = 'TerraSwap';
export const SWAPPER_THORCHAIN = 'ThorChain';
export const SWAPPER_BINANCE_BRIDGE = 'Binance Bridge';
export const SWAPPER_OSMOSIS = 'Osmosis';

export const SWAPPER_ONE_INCH_LIST = [
  SWAPPER_ONE_INCH_ETH,
  SWAPPER_ONE_INCH_BSC,
  SWAPPER_ONE_INCH_POLYGON,
];

export const NETWORKS_FOR_1INCH = [
  Networks.POLYGON,
  Networks.ETHEREUM,
  Networks.BSC,
];

export const BNB_SYMBOL = 'BNB';
export const MATIC_SYMBOL = 'MATIC';

export const NETWORK_TO_NATIVE_SYMBOL_MAP_FOR_1INCH = new Map([
  [Networks.ETHEREUM, Networks.ETHEREUM],
  [Networks.BSC, BNB_SYMBOL],
  [Networks.POLYGON, MATIC_SYMBOL],
]);

export type TokenMeta = {
  blockchain: Network;
  symbol: string;
  image: string;
  address: string | null;
  usdPrice: number | null;
  isSecondaryCoin: boolean;
  coinSource: string | null;
  coinSourceUrl: string | null;
  name: string | null;
  decimals: number;
};

export type RawAccounts = {
  blockchains: {
    name: string;
    accounts: { address: string; walletType: WalletType }[];
  }[];
} | null;

export type UserWalletBlockchain = {
  blockchain: string;
  addresses: string[];
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
  isConnected: boolean;
};

export type Blockchain = { name: Network; accounts: Account[] };
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

export type CheckTxStatusRequest = {
  requestId: string;
  txId: string;
  step: number;
};

export enum ApiMethodName {
  RequestingSwapTransaction = 'Requesting Swap Transaction',
  CreatingSwap = 'Creating Swap',
  CheckingTransactionStatus = 'Checking transaction status',
  CreateTransaction = 'Create Transaction',
  CheckApproval = 'Check TX Approval',
  GettingSwapDetail = 'Getting Swap Detail',
  GettingUserLimits = 'Getting user limits',
}

export type APIErrorCode =
  | 'TX_FAIL'
  | 'FETCH_TX_FAILED'
  | 'USER_REJECT'
  | 'CALL_WALLET_FAILED'
  | 'SEND_TX_FAILED'
  | 'CALL_OR_SEND_FAILED'
  | 'CLIENT_UNEXPECTED_BEHAVIOUR';

export type ErrorDetail = {
  extraMessage: string;
  extraMessageDetail?: string | null | undefined;
  extraMessageErrorCode: string | null;
};

export enum TransactionName {
  GenericTransaction = 'transaction',
  SendingOneInchTransaction = '1inch transaction',
  Approval = 'approve transaction',
}

export type UserSettings = {
  slippage: string;
};

export type CreateTransactionValidation = {
  balance: boolean;
  fee: boolean;
};

export type CreateTransactionRequest = {
  requestId: string;
  step: number;
  userSettings: UserSettings;
  validations: CreateTransactionValidation;
};

export type CreateTransactionResponse = {
  ok: boolean;
  error: string | null;
  transaction: Transaction;
};

export const OKX_WALLET_SUPPORTED_CHAINS = [
  Networks.ETHEREUM,
  Networks.BTC,
  Networks.BSC,
  Networks.TRON,
  Networks.SOLANA,
  Networks.POLYGON,
  Networks.FANTOM,
  Networks.ARBITRUM,
  Networks.OPTIMISM,
  Networks.CRONOS,
  Networks.BOBA,
  Networks.GNOSIS,
  Networks.MOONBEAM,
  Networks.MOONRIVER,
  Networks.HARMONY,
  Networks.LTC,
  Networks.AVAX_CCHAIN,
];

export const EXODUS_WALLET_SUPPORTED_CHAINS = [
  Networks.SOLANA,
  Networks.ETHEREUM,
  Networks.BSC,
  Networks.POLYGON,
  Networks.AVAX_CCHAIN,
  BNB_SYMBOL,
];
