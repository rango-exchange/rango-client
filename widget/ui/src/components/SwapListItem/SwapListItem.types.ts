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
  failed: 'error500',
  running: 'info500',
  success: 'success500',
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
