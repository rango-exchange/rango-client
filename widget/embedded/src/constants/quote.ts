import type { I18n } from '@lingui/core';
import type { SwapFee, TagValue } from 'rango-sdk';

export type NameOfFees =
  | 'Swapper Fee'
  | 'Affiliate Fee'
  | 'Outbound network fee'
  | 'Rango Fee'
  | 'Network Fee';

export function getFeeLabel(fee: NameOfFees, t: I18n['t']): string {
  const data: Record<NameOfFees, string> = {
    'Network Fee': t('Network Fee'),
    'Swapper Fee': t('Protocol Fee'),
    'Affiliate Fee': t('Affiliate Fee'),
    'Outbound network fee': t('Outbound Fee'),
    'Rango Fee': t('Rango Fee'),
  };
  return data[fee];
}

export type FeesGroup = {
  payable: { [key in NameOfFees]?: SwapFee[] };
  nonePayable: { [key in NameOfFees]?: SwapFee[] };
};

export const HIGH_PRIORITY_TAGS: TagValue[] = [
  'RECOMMENDED',
  'CENTRALIZED',
  'LOWEST_FEE',
  'FASTEST',
  'HIGH_IMPACT',
];

export const GAS_FEE_MAX = 30;
