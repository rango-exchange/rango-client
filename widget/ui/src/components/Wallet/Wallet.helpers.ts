import type { Info, MakeInfoOptions } from './Wallet.types.js';

import { i18n } from '@lingui/core';

import { WalletState } from './Wallet.types.js';

export function makeInfo(state: WalletState, options?: MakeInfoOptions): Info {
  switch (state) {
    case WalletState.CONNECTED:
      return {
        color: 'success500',
        description: i18n.t('Connected'),
        tooltipText: i18n.t('Disconnect'),
      };
    case WalletState.PARTIALLY_CONNECTED:
      return {
        color: 'warning500',
        description: i18n.t('Connected Partially'),
        tooltipText: i18n.t('Connect other chains'),
      };
    case WalletState.NOT_INSTALLED:
      if (options?.hasDeepLink) {
        return {
          color: 'info500',
          description: i18n.t('Open'),
          tooltipText: i18n.t('Open'),
        };
      }
      return {
        color: 'info500',
        description: i18n.t('Install'),
        tooltipText: i18n.t('Install'),
      };
    case WalletState.CONNECTING:
      return {
        color: 'neutral600',
        description: i18n.t('Connecting ...'),
        tooltipText: i18n.t('Connecting'),
      };
    case WalletState.DISCONNECTED:
      return {
        color: 'neutral600',
        description: i18n.t('Disconnected'),
        tooltipText: i18n.t('Connect'),
      };
    default:
      throw new Error(i18n.t('you need to pass a correct state to Wallet.'));
  }
}
