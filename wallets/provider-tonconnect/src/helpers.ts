import type { TonConnectUI } from '@tonconnect/ui';

import { retryLazyImport } from '@rango-dev/wallets-shared';

export async function getTonConnectUIModule() {
  const tonConnectUI = await retryLazyImport(
    async () => await import('@tonconnect/ui')
  );
  return tonConnectUI;
}

export async function getTonCoreModule() {
  const tonCore = await retryLazyImport(async () => await import('@ton/core'));
  return tonCore;
}

export async function waitForConnection(
  tonConnectUI: TonConnectUI
): Promise<string> {
  return new Promise((resolve, reject) => {
    const unsubscribeStatusChange = tonConnectUI.onStatusChange(
      (state) => {
        const walletConnected = !!state?.account.address;

        if (walletConnected) {
          unsubscribeStatusChange();
          resolve(state.account.address);
        }
      },
      (error) => {
        unsubscribeStatusChange();
        reject(error);
      }
    );

    const unsubscribeModalStateChange = tonConnectUI.onModalStateChange(
      (modalState) => {
        if (modalState.closeReason === 'action-cancelled') {
          unsubscribeStatusChange();
          unsubscribeModalStateChange();
          reject(new Error('The action was canceled by the user'));
        }
      }
    );
  });
}

export async function parseAddress(rawAddress: string): Promise<string> {
  const tonCore = await getTonCoreModule();
  return tonCore.Address.parse(rawAddress).toString({ bounceable: false });
}
