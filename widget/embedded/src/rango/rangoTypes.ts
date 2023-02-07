import { PendingSwap } from '@rangodev/ui/dist/containers/History/types';
import {
  CosmosTransaction,
  EvmTransaction,
  Network,
  SolanaTransaction,
  StarknetTransaction,
  TransferTransaction,
  TronTransaction,
  WalletType,
} from '@rangodev/wallets-shared';
import { SimulationResult } from 'rango-sdk';

type InternalStepState = 'PENDING' | 'CREATED' | 'WAITING' | 'SIGNED' | 'SUCCESSED' | 'FAILED';

export type SwapperStatusStep = {
  name: string;
  state: InternalStepState;
  current: boolean;
};

export type SwapExplorerUrl = {
  url: string;
  description: string | null;
};

export enum PendingSwapNetworkStatus {
  WaitingForConnectingWallet = 'waitingForConnectingWallet',
  WaitingForQueue = 'waitingForQueue',
  WaitingForNetworkChange = 'waitingForNetworkChange',
  NetworkChanged = 'networkChanged',
}

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

export type SwapSavedSettings = {
  slippage: string;
  disabledSwappersIds: string[];
  disabledSwappersGroups: string[];
};

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

export type SwapStatus = 'running' | 'failed' | 'success';

export interface PendingSwapWithQueueID {
  id: string;
  swap: PendingSwap;
}
