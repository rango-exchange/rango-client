import type { Environments } from './types.js';
import type * as TonConnectUIModule from '@tonconnect/ui';

import { dynamicImportWithRefinedError } from '@rango-dev/wallets-shared';

export class TonConnectAdapter {
  #tonModule?: typeof TonConnectUIModule;
  #tonConnectInstance?: TonConnectUIModule.TonConnectUI;

  async initialize(env?: Environments) {
    if (!env) {
      throw new Error('Environments are not set');
    }

    this.#tonModule = await dynamicImportWithRefinedError(
      async () => await import('@tonconnect/ui')
    );
    const { TonConnectUI } = this.#tonModule;
    this.#tonConnectInstance = new TonConnectUI(env);
  }

  getInstance() {
    if (!this.#tonConnectInstance) {
      throw new Error(
        "TonConnect instance isn't initialized. Please ensure you have provided the TonConnect config."
      );
    }
    return this.#tonConnectInstance;
  }

  getModule() {
    if (!this.#tonModule) {
      throw new Error("Couldn't initialize the TonConnect module");
    }
    return this.#tonModule;
  }

  async waitForConnection(): Promise<string> {
    const tonConnectUI = this.getInstance();
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
}
