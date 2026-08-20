import type { AppKitModal, ModalParams } from './modal.js';
import type { WalletConnectNamespace } from '../types.js';

import { createAppKitModal } from './modal.js';

/**
 * Caches the single AppKit modal, rebuilding (and closing the old one) when the
 * namespace changes - the same single-slot, namespace-guarded shape as the
 * session cache.
 */
export class ModalCache {
  #web3Modal: AppKitModal | null = null;
  #modalNamespace: WalletConnectNamespace | null = null;

  getModal(params: ModalParams): AppKitModal {
    if (!this.#web3Modal || this.#modalNamespace !== params.namespace) {
      void this.#web3Modal?.close();
      this.#web3Modal = createAppKitModal(params);
      this.#modalNamespace = params.namespace;
    }

    return this.#web3Modal;
  }
}
