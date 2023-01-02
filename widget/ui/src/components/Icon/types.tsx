import * as React from 'react';

export interface IconProps extends React.SVGAttributes<SVGElement> {
  color?: string;
  size?: number;
}

export type Icon =
  | 'AddWallet'
  | 'Check'
  | 'CircleCheck'
  | 'Error'
  | 'Download'
  | 'Gas'
  | 'Histories'
  | 'History'
  | 'HourGlass'
  | 'NoResult'
  | 'DarkSetting'
  | 'DarkWallet'
  | 'Retry'
  | 'Search'
  | 'Setting'
  | 'SettingOutline'
  | 'Swap'
  | 'SwapsHistory'
  | 'SwapWallet'
  | 'Time'
  | 'Vector'
  | 'Wallet'
  | 'Warning';
