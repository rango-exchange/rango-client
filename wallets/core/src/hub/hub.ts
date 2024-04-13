import type { Namespace, State as NamespaceState } from './namespace';
import type { Provider, State as ProviderState } from './provider';
import type { Store } from './store';

/*
 *
 * Adapter:
 *
 * connect
 * disconnect, disconnectAll
 * suggestAndConnect
 * state
 * canSwitchNetwork
 * providers
 * getWalletInfo
 * getSigners
 *
 * onUpdateState is deprecated, probably by using .use() we can handle it somehow.
 *
 */

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

  // TODO: can we suggest some predefined string using ts?
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      if (provider[action]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line
        providerOutput.provider = provider[action]();
      }

      // Namespace instances can have their own `action` as well. we will call them as well.
      const namespaces = provider.getAll().values();
      for (const namespace of namespaces) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line
        const actionFn = namespace[action];
        if (actionFn) {
          const result = actionFn();
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

  get(providerId: string) {
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
