import type { Environments } from './types.js';
import type * as TonConnectUIModule from '@tonconnect/ui';

import { Hub3Error } from '@hub3js/core';

// TonConnect SDK has no public API for discarding a pending connection, so we rely on its internal storage key.
const BRIDGE_CONNECTION_STORAGE_KEY = 'ton-connect-storage_bridge-connection';

export class TonConnectAdapter {
  #tonModule?: typeof TonConnectUIModule;
  #tonConnectInstance?: TonConnectUIModule.TonConnectUI;

  async initialize(env: Environments) {
    this.#tonModule = await import('@tonconnect/ui');
    const { TonConnectUI } = this.#tonModule;
    this.#tonConnectInstance = new TonConnectUI(env);

    this.#tonConnectInstance.onModalStateChange((modalState) => {
      if (modalState.closeReason === 'action-cancelled') {
        this.#discardPendingConnection();
      }
    });
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
            reject(
              new Hub3Error(
                'PROVIDER_USER_REJECTED_REQUEST',
                'You rejected the request',
                { cause: modalState }
              )
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

  /*
   * TonConnect starts a connection attempt as soon as the modal opens and doesn't clean it up when the user cancels:
   * 1. It keeps retrying unreachable bridges until the attempt is aborted.
   * 2. It keeps the attempt in storage, and reopens every wallet's bridge on each page load to restore it.
   */
  #discardPendingConnection() {
    const tonConnectUI = this.getInstance();
    if (tonConnectUI.connected) {
      return;
    }

    // The SDK has no public `abort`. Restoring with an aborted signal only aborts the current attempt and returns.
    void tonConnectUI.connector.restoreConnection({
      signal: AbortSignal.abort(),
    });

    try {
      window.localStorage.removeItem(BRIDGE_CONNECTION_STORAGE_KEY);
    } catch {
      // Storage may be unavailable (e.g. blocked site data), there is nothing to clean up then.
    }
  }
}
