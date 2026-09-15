import type { AppKitModal, ModalParams } from './modal.js';

import { createAppKitModal } from './modal.js';

/**
 * Holds the single AppKit modal for the adapter's lifetime.
 *
 * One instance serves every namespace - all its networks are registered up front
 * and the active one is chosen per connect with `switchNetwork`. It is built once
 * and reused: rebuilding per namespace re-ran AppKit init against its shared
 * singleton controllers and left stale router/filter state behind.
 */
export class ModalCache {
  #web3Modal: AppKitModal | null = null;

  getModal(params: ModalParams): AppKitModal {
    if (!this.#web3Modal) {
      this.#web3Modal = createAppKitModal(params);
    }

    return this.#web3Modal;
  }
}
