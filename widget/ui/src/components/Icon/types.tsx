import * as React from 'react';

export interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
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
  | 'Loading'
  | 'Wallet'
  | 'AddWallet'
  | 'DeleteWallet'
  | 'CheckWallet'
  | 'SwapWallet'
  | 'Bag';
