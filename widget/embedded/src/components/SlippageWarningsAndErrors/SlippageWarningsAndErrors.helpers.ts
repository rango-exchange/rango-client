import type { AlertInfo } from '../QuoteWarningsAndErrors/QuoteWarningsAndErrors.helpers';

import { i18n } from '@lingui/core';

import { HIGH_SLIPPAGE, MIN_SLIPPAGE } from '../../constants/swapSettings';

export type ActionType = AlertInfo['action'] | 'reset-slippage';

type Alert = Omit<AlertInfo, 'action'> & {
  action: ActionType;
};

export function makeAlerts(slippage: number): Alert | null {
  let alertInfo: Alert | null = null;
  if (slippage === MIN_SLIPPAGE) {
    alertInfo = {
      alertType: 'error',
      action: 'reset-slippage',
      actionButtonTitle: i18n.t('Reset'),
      title: i18n.t('Slippage cannot be set lower than 0.01%.'),
    };
    return alertInfo;
  } else if (slippage > HIGH_SLIPPAGE) {
    alertInfo = {
      alertType: 'warning',
      action: 'change-settings',
      actionButtonTitle: i18n.t('Change'),
      title: i18n.t('Caution, your slippage is high!'),
    };
    return alertInfo;
  }
  return null;
}
