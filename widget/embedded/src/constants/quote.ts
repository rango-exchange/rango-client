import type { SwapFee } from 'rango-sdk';

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
