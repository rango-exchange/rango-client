import type { Environments } from './types.js';
import type * as TonConnectUIModule from '@tonconnect/ui';

import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';

export class TonConnectAdapter {
  #tonModule?: typeof TonConnectUIModule;
  #tonConnectInstance?: TonConnectUIModule.TonConnectUI;

  async initialize(env?: Environments) {
    if (!env) {
      throw new Error('Environments are not set');
    }

    this.#tonModule = await import('@tonconnect/ui');
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
    const { UserRejectsError } = this.getModule();
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
          if (error instanceof UserRejectsError) {
            Object.assign(error, { code: USER_REJECTION_ERROR_CODE });
          }
          reject(error);
        }
      );

      const unsubscribeModalStateChange = tonConnectUI.onModalStateChange(
        (modalState) => {
          if (modalState.closeReason === 'action-cancelled') {
            unsubscribe();
            reject(
              Object.assign(new Error('The action was canceled by the user'), {
                code: USER_REJECTION_ERROR_CODE,
              })
            );
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
