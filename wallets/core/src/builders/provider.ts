import type {
  CommonNamespaces,
  InternalMethods,
  ProviderBuilderOptions,
} from '../hub/provider';
import type { ProviderConfig } from '../hub/store';

import { Provider } from '../hub/provider';

export class ProviderBuilder {
  private id: string;
  private namespaces = new Map();
  private methods: InternalMethods = {};
  #configs: Partial<ProviderConfig> = {};
  #options: Partial<ProviderBuilderOptions>;

  constructor(id: string, options?: ProviderBuilderOptions) {
    this.id = id;
    this.#options = options || {};
  }

  add<K extends keyof CommonNamespaces>(
    id: K,
    blockchain: CommonNamespaces[K]
  ) {
    if (this.#options.store) {
      /*
       * TODO: CommonBlockchains only returning specific interface for each namespace
       * in fact it should return each namespace + default methods on `BlockchainPorivder`
       */
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      blockchain.store(this.#options.store);
    }
    this.namespaces.set(id, blockchain);
    return this;
  }

  config<K extends keyof ProviderConfig>(name: K, value: ProviderConfig[K]) {
    this.#configs[name] = value;
    return this;
  }

  init(cb: Exclude<InternalMethods['init'], undefined>) {
    this.methods.init = cb;
    return this;
  }

  build(): Provider {
    if (this.#isConfigsValid(this.#configs)) {
      return new Provider(this.id, this.namespaces, this.#configs, {
        internalMethods: this.methods,
        store: this.#options.store,
      });
    }

    throw new Error('You need to set all required configs.');
  }

  #isConfigsValid(config: Partial<ProviderConfig>): config is ProviderConfig {
    return !!config.info;
  }
}
