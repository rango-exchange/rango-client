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

export const ROUTE_STRATEGY: { value: PreferenceType; label: string }[] = [
  {
    value: 'SMART',
    label: i18n.t('Smart Routing'),
  },
  {
    value: 'FEE',
    label: i18n.t('Lowest Fee'),
  },
  {
    value: 'SPEED',
    label: i18n.t('Fastest Transfer'),
  },
  {
    value: 'NET_OUTPUT',
    label: i18n.t('Maximum Return'),
  },
  {
    value: 'PRICE',
    label: i18n.t('Maximum Output'),
  },
];

export const HIGH_PRIORITY_TAGS: TagValue[] = [
  'RECOMMENDED',
  'CENTRALIZED',
  'LOWEST_FEE',
  'FASTEST',
  'HIGH_IMPACT',
];
