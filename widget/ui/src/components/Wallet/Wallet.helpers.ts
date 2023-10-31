import type { Info } from './Wallet.types';

import { i18n } from '@lingui/core';

import { WalletState } from './Wallet.types';

export function makeInfo(state: WalletState): Info {
  switch (state) {
    case WalletState.CONNECTED:
      return {
        color: 'success500',
        description: i18n.t('Connected'),
        tooltipText: i18n.t('Disconnect'),
      };
    case WalletState.NOT_INSTALLED:
      return {
        color: 'info500',
        description: i18n.t('Install'),
        tooltipText: i18n.t('Install'),
      };
    case WalletState.CONNECTING:
      return {
        color: 'neutral600',
        description: i18n.t('Connecting...'),
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
