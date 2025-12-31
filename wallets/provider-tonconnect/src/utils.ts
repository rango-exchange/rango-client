import type { Environments, Provider } from './types.js';
import type { TonConnectUI } from '@tonconnect/ui';

import {
  dynamicImportWithRefinedError,
  Networks,
} from '@rango-dev/wallets-shared';

let tonConnectInstance: TonConnectUI;
let envs: Environments;

export function setEnvs(_envs: Environments) {
  envs = _envs;
}

export async function getTonConnectUIModule() {
  const tonConnectUI = await dynamicImportWithRefinedError(
    async () => await import('@tonconnect/ui')
  );
  return tonConnectUI;
}

export async function initializeTonConnectInstance() {
  if (!envs) {
    throw new Error('Environments are not set');
  }
  const { TonConnectUI } = await getTonConnectUIModule();
  if (!tonConnectInstance) {
    tonConnectInstance = new TonConnectUI(envs);
  }
}

export function tonConnect() {
  if (!tonConnectInstance) {
    throw new Error(
      "TonConnect instance isn't initialized. Please ensure you have provided the TonConnect config."
    );
  }

  return tonConnectInstance;
}

export function getInstanceOrThrow(): Provider {
  const instance = tonConnect();

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
