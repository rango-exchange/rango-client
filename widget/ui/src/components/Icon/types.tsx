import * as React from 'react';

export interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: 16 | 18 | 20 | 24;
  color?: 'primary' | 'error' | 'warning' | 'success' | 'black' | 'white';
}

export type Icon =
  | 'DeleteCircle'
  | 'CheckSquare'
  | 'AddCircle'
  | 'InfoCircle'
  | 'Add'
  | 'MinusCircle'
  | 'CheckCircle'
  | 'Ban'
  | 'Warning'
  | 'History'
  | 'Gas'
  | 'Setting'
  | 'Trash'
  | 'SearchMinus'
  | 'Search'
  | 'AngleRight'
  | 'AngleUp'
  | 'AngleDown'
  | 'AngleLeft'
  | 'Download'
  | 'RetryRight'
  | 'RetryLeft'
  | 'TryAgain'
  | 'VerticalSwap'
  | 'HorizontalSwap'
  | 'Retry'
  | 'Wallet'
  | 'AddWallet'
  | 'DeleteWallet'
  | 'CheckWallet'
  | 'SwapWallet'
  | 'Bag'
  | 'Check'
  | 'Time'
  | 'Close';
