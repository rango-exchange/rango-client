export type SwapStatus = 'running' | 'failed' | 'success';
export type MessageSeverity = 'error' | 'warning' | 'info' | 'success';

type InternalStepState =
  | 'PENDING'
  | 'CREATED'
  | 'WAITING'
  | 'SIGNED'
  | 'SUCCESSED'
  | 'FAILED';

export enum Network {
  BTC = 'BTC',
  BSC = 'BSC',
  LTC = 'LTC',
  THORCHAIN = 'THOR',
  BCH = 'BCH',
  BINANCE = 'BNB',
  ETHEREUM = 'ETH',
  POLYGON = 'POLYGON',
  TERRA = 'TERRA',
  POLKADOT = '',
  TRON = 'TRON',
  DOGE = 'DOGE',
  HARMONY = 'HARMONY',
  AVAX_CCHAIN = 'AVAX_CCHAIN',
  FANTOM = 'FANTOM',
  MOONBEAM = 'MOONBEAM',
  ARBITRUM = 'ARBITRUM',
  BOBA = 'BOBA',
  OPTIMISM = 'OPTIMISM',
  FUSE = 'FUSE',
  CRONOS = 'CRONOS',
  SOLANA = 'SOLANA',
  MOONRIVER = 'MOONRIVER',
  GNOSIS = 'GNOSIS',
  COSMOS = 'COSMOS',
  OSMOSIS = 'OSMOSIS',
  AKASH = 'AKASH',
  IRIS = 'IRIS',
  PERSISTENCE = 'PERSISTENCE',
  SENTINEL = 'SENTINEL',
  REGEN = 'REGEN',
  CRYPTO_ORG = 'CRYPTO_ORG',
  SIF = 'SIF',
  CHIHUAHUA = 'CHIHUAHUA',
  JUNO = 'JUNO',
  KUJIRA = 'KUJIRA',
  STARNAME = 'STARNAME',
  COMDEX = 'COMDEX',
  STARGAZE = 'STARGAZE',
  DESMOS = 'DESMOS',
  BITCANNA = 'BITCANNA',
  SECRET = 'SECRET',
  INJECTIVE = 'INJECTIVE',
  LUMNETWORK = 'LUMNETWORK',
  BANDCHAIN = 'BANDCHAIN',
  EMONEY = 'EMONEY',
  BITSONG = 'BITSONG',
  KI = 'KI',
  MEDIBLOC = 'MEDIBLOC',
  KONSTELLATION = 'KONSTELLATION',
  UMEE = 'UMEE',

  // Using instead of null
  Unknown = 'Unkown',
}
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
  | 'Wormhole';

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
export type Asset = {
  blockchain: Network | any;
  symbol: string;
  address: string | null;
};
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
export type SwapResult = {
  swapperId: SwapperId;
  from: SwapResultAsset;
  to: SwapResultAsset;
  swapperType: string;
  fromAmount: string;
  fromAmountPrecision: number | null;
  fromAmountRestrictionType: null | 'EXCLUSIVE' | 'INCLUSIVE';
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

export type PendingSwapStep = {
  id: number;
  fromBlockchain: string;
  fromSymbol: string;
  fromSymbolAddress: string | null;
  fromDecimals: number;
  fromAmountPrecision: number | null;
  fromAmountMinValue: number | null;
  fromAmountMaxValue: number | null;
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
  outputAmount: string | null;
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
