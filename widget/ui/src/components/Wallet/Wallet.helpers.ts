import type { Info } from './Wallet.types';

import { WalletState } from './Wallet.types';

export function makeInfo(state: WalletState): Info {
  switch (state) {
    case WalletState.CONNECTED:
      return {
        color: 'success500',
        description: 'Connected',
        tooltipText: 'Disconnect',
      };
    case WalletState.NOT_INSTALLED:
      return {
        color: 'info500',
        description: 'Install',
        tooltipText: 'Install',
      };
    case WalletState.CONNECTING:
      return {
        color: 'neutral800',
        description: 'Connecting...',
        tooltipText: 'Connecting',
      };
    case WalletState.DISCONNECTED:
      return {
        color: 'neutral800',
        description: 'Disconnected',
        tooltipText: 'Connect',
      };
    default:
      throw new Error('you need to pass a correct state to Wallet.');
  }
}
