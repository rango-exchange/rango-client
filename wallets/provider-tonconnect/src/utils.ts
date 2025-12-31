import type { Provider } from './types.js';
import type { TonConnectUI } from '@tonconnect/ui';

import { Networks } from '@rango-dev/wallets-shared';

import { TonConnect } from './tonConnect.js';

export const tonConnect = new TonConnect();

export function getInstanceOrThrow(): Provider {
  const instance = tonConnect.getInstance();

  const instances = new Map([[Networks.TON, instance]]);
  return instances as Provider;
}

export async function waitForConnection(
  tonConnectUI: TonConnectUI
): Promise<string> {
  return new Promise((resolve, reject) => {
    const unsubscribeStatusChange = tonConnectUI.onStatusChange(
      (state) => {
        const walletConnected = !!state?.account.address;

        if (walletConnected) {
          unsubscribe();
          resolve(state.account.address);
        }
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );

    const unsubscribeModalStateChange = tonConnectUI.onModalStateChange(
      (modalState) => {
        if (modalState.closeReason === 'action-cancelled') {
          unsubscribe();
          reject(new Error('The action was canceled by the user'));
        }
      }
    );

    const unsubscribe = () => {
      unsubscribeStatusChange();
      unsubscribeModalStateChange();
    };
  });
}
