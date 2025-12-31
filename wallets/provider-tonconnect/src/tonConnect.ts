import type { Environments } from './types.js';
import type { TonConnectUI } from '@tonconnect/ui';

import { dynamicImportWithRefinedError } from '@rango-dev/wallets-shared';

export class TonConnect {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  #tonModule?: typeof import('@tonconnect/ui');
  #env?: Environments;
  #tonConnectInstance?: TonConnectUI;

  async initialize(env?: Environments) {
    if (!env) {
      throw new Error('Environments are not set');
    }
    this.#env = env;
    if (this.#env) {
      throw new Error('Environments are not set');
    }

    this.#tonModule = await dynamicImportWithRefinedError(
      async () => await import('@tonconnect/ui')
    );
    const { TonConnectUI } = this.#tonModule;
    this.#tonConnectInstance = new TonConnectUI(this.#env);
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
}
