import type { PreferenceType, SwapFee, TagValue } from 'rango-sdk';

import { i18n } from '@lingui/core';

export type NameOfFees =
  | 'Swapper Fee'
  | 'Affiliate Fee'
  | 'Outbound network fee'
  | 'Rango Fee'
  | 'Network Fee';

export const NAME_OF_FEES: Record<NameOfFees, string> = {
  'Network Fee': i18n.t('Network Fee'),
  'Swapper Fee': i18n.t('Protocol Fee'),
  'Affiliate Fee': i18n.t('Affiliate Fee'),
  'Outbound network fee': i18n.t('Outbound Fee'),
  'Rango Fee': i18n.t('Rango Fee'),
};

export type FeesGroup = {
  payable: { [key in NameOfFees]?: SwapFee[] };
  nonePayable: { [key in NameOfFees]?: SwapFee[] };
};

export const ROUTE_SORTING_STRATEGY: { [key in PreferenceType]: string } = {
  SPEED: i18n.t('Fastest Transfer'),
  NET_OUTPUT: i18n.t('Maximum Return'),
  FEE: i18n.t('Lowest Fee'),
  PRICE: i18n.t('Maximum Output'),
  SMART: i18n.t('Smart Routing'),
};

export const HIGH_PRIORITY_TAGS: TagValue[] = [
  'RECOMMENDED',
  'CENTRALIZED',
  'LOWEST_FEE',
  'FASTEST',
  'HIGH_IMPACT',
];

export const GAS_FEE_MAX = 30;
