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

export type Criteria = {
  threshold: number;
  minInput: number;
};

export const PERCENT_MULTIPLIER = 100;
export const GAS_FEE_MAX = 30;
export const ROUTE_TIME_MAX = 15;
export const SECONDS_IN_MINUTE = 60;
export const HIGH_FEE_THRESHOLD_USD = 30;

export const HIGH_VALUE_LOSS_CRITERIA: Criteria[] = [
  { threshold: -10, minInput: 400 },
  { threshold: -5, minInput: 1000 },
];

export const OUTPUT_CHANGE_WARNING_CRITERIA: Criteria[] = [
  {
    threshold: -1,
    minInput: 1000,
  },
  {
    threshold: -2,
    minInput: 500,
  },
];
