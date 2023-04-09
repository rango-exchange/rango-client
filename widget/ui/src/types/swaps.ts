import {
  BestRouteResponse,
  BlockchainValidationStatus,
  SimulationResult,
  SwapResult,
  WalletRequiredAssets,
} from 'rango-sdk';
export type SwapStatus = 'running' | 'failed' | 'success';
export type MessageSeverity = 'error' | 'warning' | 'info' | 'success';

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

export type WalletTypeAndAddress = {
  walletType: string;
  address: string;
};
export type SwapSavedSettings = {
  slippage: string;
  disabledSwappersIds: string[];
  disabledSwappersGroups: string[];
};

export type SimulationAssetAndAmount = WalletRequiredAssets;
export type SimulationValidationStatus = BlockchainValidationStatus;
export type BestRouteType = BestRouteResponse;

export type BestRouteWithFee = Omit<BestRouteResponse, 'result'> & {
  result: Omit<SimulationResult, 'swaps'> & {
    swaps: (SwapResult & { feeInUsd?: string })[];
  };
};
