export type Status = 'running' | 'failed' | 'success';

export interface PropTypes {
  requestId: string;
  creationTime: string;
  status: Status;
  onClick: (requestId: string) => void;
  swapTokenData: SwapTokenData;
  onlyShowTime?: boolean;
}

export const StatusColors = {
  failed: 'error',
  running: 'info',
  success: 'success',
};

export interface SwapTokenData {
  from: {
    token: {
      image: string;
      displayName: string;
    };
    blockchain: {
      image: string;
    };
    amount: string;
  };

  to: {
    token: {
      image: string;
      displayName: string;
    };
    blockchain: {
      image: string;
    };
    amount: string;
    estimatedAmount?: string;
  };
}
