export type Status = 'running' | 'failed' | 'success';

export interface SwapListItemProps {
  requestId: string;
  creationTime: string;
  status: Status;
  onClick: (requestId: string) => void;
  swapTokenData: SwapTokenData;
  onlyShowTime?: boolean;
  tooltipContainer?: HTMLElement;
}

export interface LoadingProps {
  isLoading: true;
}

export type PropTypes = SwapListItemProps | LoadingProps;

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
    realAmount: string;
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
    realAmount: string;
  };
}
