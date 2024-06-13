import type { NamespaceInterface } from './types.js';
import type {
  CommonNamespaces,
  ExtendableInternalActions,
  ProviderBuilderOptions,
} from '../hub/provider.js';
import type { ProviderConfig } from '../hub/store.js';

import { Provider } from '../hub/provider.js';

export class ProviderBuilder {
  #id: string;
  #namespaces = new Map();
  #methods: ExtendableInternalActions = {};
  #configs: Partial<ProviderConfig> = {};
  #options: Partial<ProviderBuilderOptions>;

  constructor(id: string, options?: ProviderBuilderOptions) {
    this.#id = id;
    this.#options = options || {};
  }

  public add<K extends keyof CommonNamespaces>(
    id: K,
    namespace: NamespaceInterface<K, CommonNamespaces>
  ) {
    if (this.#options.store) {
      namespace.store(this.#options.store);
    }
    this.#namespaces.set(id, namespace);
    return this;
  }

  public config<K extends keyof ProviderConfig>(
    name: K,
    value: ProviderConfig[K]
  ) {
    this.#configs[name] = value;
    return this;
  }

  public init(cb: Exclude<ExtendableInternalActions['init'], undefined>) {
    this.#methods.init = cb;
    return this;
  }

  public build(): Provider {
    if (this.#isConfigsValid(this.#configs)) {
      return new Provider(this.#id, this.#namespaces, this.#configs, {
        extendInternalActions: this.#methods,
        store: this.#options.store,
      });
    }

    throw new Error('You need to set all required configs.');
  }

  #isConfigsValid(config: Partial<ProviderConfig>): config is ProviderConfig {
    return !!config.info;
  }
}
