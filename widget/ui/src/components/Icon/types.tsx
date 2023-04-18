import * as React from 'react';

export interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: 12 | 16 | 18 | 20 | 24 | 28 | 32 | 36 | 40;
  color?: 'primary' | 'error' | 'warning' | 'success' | 'black' | 'white';
  disabled?: boolean;
}

export type Icon =
  | 'DeleteCircleIcon'
  | 'CheckSquareIcon'
  | 'AddIcon'
  | 'InfoCircleIcon'
  | 'AddCircleIcon'
  | 'MinusCircleIcon'
  | 'CheckCircleIcon'
  | 'CheckIcon'
  | 'BanIcon'
  | 'WarningIcon'
  | 'HistoryIcon'
  | 'GasIcon'
  | 'SettingsIcon'
  | 'TrashIcon'
  | 'SearchMinusIcon'
  | 'SearchIcon'
  | 'AngleRightIcon'
  | 'AngleUpIcon'
  | 'AngleDownIcon'
  | 'AngleLeftIcon'
  | 'DownloadIcon'
  | 'RetryRightIcon'
  | 'RetryLeftIcon'
  | 'TryAgainIcon'
  | 'VerticalSwapIcon'
  | 'HorizontalSwapIcon'
  | 'RetryIcon'
  | 'WalletIcon'
  | 'AddWalletIcon'
  | 'DeleteWalletIcon'
  | 'CheckWalletIcon'
  | 'SwapWalletIcon'
  | 'BagIcon'
  | 'TimeIcon'
  | 'CloseIcon'
  | 'SignatureIcon'
  | 'CopyIcon';
