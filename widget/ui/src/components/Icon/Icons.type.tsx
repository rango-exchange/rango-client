import * as React from 'react';

export interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: 12 | 14 | 16 | 18 | 20 | 24 | 28 | 32 | 36 | 40;
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'success'
    | 'black'
    | 'white'
    | 'gray'
    | 'info';
}

export type Icon =
  | 'InfoRegularIcon'
  | 'CheckCircleIcon'
  | 'CheckIcon'
  | 'WarningIcon'
  | 'HistoryIcon'
  | 'GasIcon'
  | 'SettingsIcon'
  | 'TrashIcon'
  | 'SearchIcon'
  | 'AngleRightIcon'
  | 'AngleUpIcon'
  | 'AngleDownIcon'
  | 'AngleLeftIcon'
  | 'DownloadIcon'
  | 'VerticalSwapIcon'
  | 'HorizontalSwapIcon'
  | 'RetryIcon'
  | 'WalletIcon'
  | 'AddWalletIcon'
  | 'TimeIcon'
  | 'CloseIcon'
  | 'SignatureIcon'
  | 'CopyIcon'
  | 'NotificationIcon'
  | 'ShareIcon'
  | 'StepsIcon'
  | 'ConnectIcon'
  | 'PercentIcon'
  | 'LightThemeIcon'
  | 'DarkThemeIcon'
  | 'AutoThemeIcon'
  | 'PinIcon'
  | 'ErrorIcon'
  | 'InfoSolidIcon';
