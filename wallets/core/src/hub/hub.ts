import type { Namespace, State as NamespaceState } from './namespace.js';
import type { Provider, State as ProviderState } from './provider.js';
import type { Store } from './store.js';

type HubState = {
  [key in string]: ProviderState & {
    namespaces: NamespaceState[];
  };
};

type RunAllResult = {
  id: string;
  provider: unknown;
  namespaces: unknown[];
};

interface HubOptions {
  store?: Store;
}
export class Hub {
  #providers = new Map<string, Provider>();
  #options: HubOptions;

  constructor(options?: HubOptions) {
    this.#options = options ?? {};
    /*
     * TODO:
     * config:
     * isEagerConnectEnabled? (warning if explicitly calls eagerConnect)
     *
     */
    this.init();
  }

  init() {
    this.runAll('init');
  }

  /*
   * Running a specific action (e.g. init) on all namespaces and providers one by one.
   *
   *  TODO: Some of methods may accepts args, with this implementation we only limit to those one without any argument.
   */
  runAll(action: string): RunAllResult[] {
    const output: RunAllResult[] = [];

    // run action on all providers eagerConnect, disconnect
    const providers = this.#providers.values();

    for (const provider of providers) {
      // Calling `action` on `Provider` if exists.
      const providerOutput: RunAllResult = {
        id: provider.id,
        provider: undefined,
        namespaces: [],
      };

      const providerMethod = provider[action as keyof Provider];
      if (typeof providerMethod === 'function') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line
        providerOutput.provider = providerMethod.call(provider);
      }

      // Namespace instances can have their own `action` as well. we will call them as well.
      const namespaces = provider.getAll().values();
      for (const namespace of namespaces) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line
        const namespaceMethod = namespace[action];
        if (typeof namespaceMethod === 'function') {
          const result = namespaceMethod();
          providerOutput.namespaces.push(result);
        }
      }

      output.push(providerOutput);
    }

    return output;
  }

  add(id: string, provider: Provider) {
    if (this.#options.store) {
      provider.store(this.#options.store);
    }
    this.#providers.set(id, provider);
    return this;
  }

  get(providerId: string): Provider | undefined {
    return this.#providers.get(providerId);
  }

  getAll() {
    return this.#providers;
  }

  state(): HubState {
    const output = this.runAll('state');
    const res: HubState = {};

    output.forEach((result) => {
      const namespaces: NamespaceState[] = [];
      result.namespaces.forEach((b) => {
        const [getNamespaceState] = b as ReturnType<Namespace<any>['state']>;

        namespaces.push(getNamespaceState());
      });

      const [getProviderState] = result.provider as ReturnType<
        Provider['state']
      >;

      res[result.id] = {
        ...(getProviderState() || {}),
        namespaces: namespaces,
      };
    });
    return res;
  }
}
