import { Network } from '@rangodev/wallets-shared';
import { BestRouteResponse } from 'rango-sdk';
export type SwapStatus = 'running' | 'failed' | 'success';
export type MessageSeverity = 'error' | 'warning' | 'info' | 'success';

type InternalStepState =
  | 'PENDING'
  | 'CREATED'
  | 'WAITING'
  | 'SIGNED'
  | 'SUCCESSED'
  | 'FAILED';

export type StepStatus =
  | 'created'
  | 'running'
  | 'failed'
  | 'success'
  | 'waitingForApproval'
  | 'approved';
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
  | 'Wormhole'
  | 'AnySwap Aggregator'
  | 'PangolinSwap'
  | 'ParaSwap Bsc'
  | 'Satellite';

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
export type WalletTypeAndAddress = {
  walletType: string;
  address: string;
};

export enum GenericTransactionType {
  EVM = 'EVM',
  TRANSFER = 'TRANSFER',
  COSMOS = 'COSMOS',
  SOLANA = 'SOLANA',
}
export type CosmosFeeAmount = { denom: string; amount: string };
export type CosmosFee = { gas: string; amount: CosmosFeeAmount[] };
export type AssetWithTicker = {
  blockchain: Network | any;
  symbol: string;
  address: string | null;
  ticker: string;
};
export type CosmosRawTransferData = {
  method: string;
  asset: AssetWithTicker;
  amount: string;
  decimals: number;
  recipient: string;
  memo: string | null;
};
export type CosmosMessage = {
  chainId: string | null;
  account_number: number | null;
  sequence: string | null;
  msgs: any[];
  protoMsgs: any[];
  memo: string | null;
  source: number | null;
  fee: CosmosFee | null;
  signType: 'AMINO' | 'DIRECT';
  rpcUrl: null | string;
};
export type CosmosTransaction = {
  fromWalletAddress: string;
  type: GenericTransactionType.COSMOS | string;
  blockChain: Network | any;
  data: CosmosMessage;
  rawTransfer: CosmosRawTransferData | null;
  externalTxId: string | null;
  id: string;
};

export type EvmTransaction = {
  blockChain: Network | any;
  type: GenericTransactionType.EVM;
  from: string | null;
  to: string;
  data: string | null;
  value: string | null;
  gasLimit: string | null;
  gasPrice: string | null;
  nonce: string | null;
  externalTxId: string | null;
  isApprovalTx: boolean;
  id: string;
};
export type SwapperStatusStep = {
  name: string;
  state: InternalStepState;
  current: boolean;
};
export type TimeStat = {
  min: number;
  avg: number;
  max: number;
};

export type ExpenseType = 'FROM_SOURCE_WALLET' | 'DECREASE_FROM_OUTPUT';

export type SwapFee = {
  asset: Asset;
  amount: string;
  expenseType: ExpenseType;
};
export type SwapSavedSettings = {
  slippage: string;
  disabledSwappersIds: string[];
  disabledSwappersGroups: string[];
};
export type SwapResultAsset = {
  symbol: string;
  logo: string;
  blockchainLogo: string;
  address: string | null;
  blockchain: Network | any;
  decimals: number;
  usdPrice: number | null;
};
export type RecommendedSlippage = {
  error: boolean;
  slippage: string | null;
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

export type TransferTransaction = {
  fromWalletAddress: string;
  type: GenericTransactionType.TRANSFER;
  method: string;
  recipientAddress: string | null;
  memo: string | null;
  amount: string;
  decimals: number;
  asset: AssetWithTicker;
  externalTxId: string | null;
  id: string;
};

export type SolanaSignature = {
  signature: number[];
  publicKey: string;
};
export type SolanaInstructionKey = {
  pubkey: string;
  isSigner: boolean;
  isWritable: boolean;
};
export type SolanaInstruction = {
  keys: SolanaInstructionKey[];
  programId: string;
  data: number[];
};
export type SolanaTransaction = {
  blockChain: Network | any;
  from: string;
  identifier: string;
  type: GenericTransactionType.SOLANA;
  externalTxId: string | null;
  recentBlockhash: string;
  signatures: SolanaSignature[];
  serializedMessage: number[] | null;
  instructions: SolanaInstruction[];
};

export type Asset = {
  blockchain: Network | any;
  symbol: string;
  address: string | null;
};

export type SimulationResult = {
  outputAmount: string;
  swaps: SwapResult[];
};
export type SwapResult = {
  result: any;
  swapperId: SwapperId;
  swapperLogo: string;
  from: SwapResultAsset;
  to: SwapResultAsset;
  swapperType: string;
  fromAmount: string;
  fromAmountPrecision: string | null;
  fromAmountRestrictionType: null | 'EXCLUSIVE' | 'INCLUSIVE';
  fromAmountMinValue: string | null;
  fromAmountMaxValue: string | null;
  toAmount: string;
  fee: SwapFee[];
  estimatedTimeInSeconds: number;
  timeStat: TimeStat | null;
  swapChainType: string;
  routes: SwapRoute[] | null;
  recommendedSlippage: RecommendedSlippage | null;
  includesDestinationTx: boolean | null | undefined;
  //todo : remove this property and fix best route and pending swap type
  explorerUrl?: SwapExplorerUrl[] | null;
};

export type WalletRequiredAssetReason =
  | 'FEE'
  | 'INPUT_ASSET'
  | 'FEE_AND_INPUT_ASSET';
export type Amount = { amount: string; decimals: number };

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
export type BestRouteType = BestRouteResponse