/* eslint-disable @typescript-eslint/ban-types */
import type { SpecificMethods } from './namespace';
import type { ProviderConfig, Store } from './store';
import type { NamespaceApi } from '../builders';
import type { LegacyState as V0State } from '../legacy/wallet';
import type {
  AnyFunction,
  FunctionWithContext,
} from '../namespaces/common/types';
import type { CosmosActions } from '../namespaces/cosmos/types';
import type { EvmActions } from '../namespaces/evm/types';
import type { SolanaActions } from '../namespaces/solana/types';

export type Context = {
  state: () => [GetState, SetState];
};
export type State = Omit<V0State, 'reachable' | 'accounts' | 'network'>;
type SetState = <K extends keyof Pick<State, 'installed'>>(
  name: K,
  value: State[K]
) => void;
type GetState = {
  (): State;
  <K extends keyof State>(name: K): State[K];
};

export interface CommonNamespaces {
  evm: EvmActions;
  solana: SolanaActions;
  cosmos: CosmosActions;
}

export interface InternalMethods {
  init?: FunctionWithContext<AnyFunction, Context>;
}

type NamespaceInterface<K extends keyof T, T> = T[K] extends SpecificMethods<
  T[K]
>
  ? NamespaceApi<T[K]>
  : never;

type NamespacesMap<K extends keyof T, T> = Map<K, NamespaceInterface<K, T>>;

export class Provider {
  public id: string;
  public version = '1.0';

  #namespaces: NamespacesMap<keyof CommonNamespaces, CommonNamespaces>;
  #initiated = false;
  // TODO: better name and also better typing for sure.
  #internalMethods: InternalMethods = {};
  #store: Store | undefined;
  #configs: ProviderConfig;

  constructor(
    id: string,
    namespaces: NamespacesMap<keyof CommonNamespaces, CommonNamespaces>,
    configs: ProviderConfig,
    options: {
      internalMethods: InternalMethods;
      store?: Store;
    }
  ) {
    this.id = id;
    this.#configs = configs;
    // it should be only created here, to make sure `after/before` will work properly.
    this.#internalMethods = options.internalMethods;
    this.#namespaces = namespaces;

    if (options.store) {
      this.#store = options.store;
      this.#setupStore();
    }
  }

  state(): [GetState, SetState] {
    const store = this.#store;
    if (!store) {
      throw new Error(
        'You need to set your store using `.store` method first.'
      );
    }

    const setState: SetState = (name, value) => {
      switch (name) {
        case 'installed':
          return store.getState().providers.updateStatus(this.id, name, value);
        default:
          throw new Error('Unhandled state for provider');
      }
    };

    const getState: GetState = <K extends keyof State>(name?: K) => {
      const state: State = store
        .getState()
        .providers.guessNamespacesState(this.id);

      if (!name) {
        return state;
      }

      switch (name) {
        case 'installed':
        case 'connected':
        case 'connecting':
          return state[name];
        default:
          throw new Error('Unhandled state for provider');
      }
    };

    return [getState, setState];
  }

  // TODO: Could we somehow type some part of the ReturnType at least?
  getAll() {
    return this.#namespaces;
  }

  get<K extends keyof CommonNamespaces>(id: K) {
    return this.#namespaces.get(id) as unknown as
      | NamespaceInterface<K, CommonNamespaces>
      | undefined;
  }

  // TODO: Could we somehow type some part of the ReturnType at least?
  findBy(options: { namespace?: string }): object | undefined {
    if (options.namespace) {
      // If we didn't found any match, we will return `undefined`.
      let result: object | undefined = undefined;

      this.#namespaces.forEach((namespace) => {
        if (namespace.namespace === options.namespace) {
          result = namespace;
        }
      });

      return result;
    }

    throw new Error(
      `Couldn't found any namespace. Make sure you've passed correct options to 'findBy'`
    );
  }

  info(): ProviderConfig['info'] | undefined {
    const store = this.#store;
    if (!store) {
      throw new Error(
        'You need to set your store using `.store` method first.'
      );
    }

    return store.getState().providers.list[this.id].config.info;
  }

  init() {
    const definedInitByUser = this.#internalMethods.init;
    if (!definedInitByUser) {
      console.debug(
        "[Namespace] this namespace doesn't have any `init` implemented."
      );
      return;
    }

    if (this.#initiated) {
      console.log('[Namespace] initiated already.');
      return;
    }

    definedInitByUser.bind(null, this.#context())();
    this.#initiated = true;
    console.debug('[Namespace] initiated successfully.');
  }

  before(action: string, cb: FunctionWithContext<AnyFunction, Context>) {
    // TODO: `before` and `after` is duplicated
    const context = {
      state: this.state.bind(this),
    };
    const cbWithContext = cb.bind(context);

    this.#namespaces.forEach((namespace) => {
      namespace.before(action as any, cbWithContext);
    });
    return this;
  }

  after(action: string, cb: AnyFunction) {
    const context = {
      state: this.state.bind(this),
    };
    const cbWithContext = cb.bind(context);
    this.#namespaces.forEach((namespace) => {
      namespace.after(action as any, cbWithContext);
    });
    return this;
  }

  store(store: Store) {
    if (this.#store) {
      console.warn(
        "You've already set an store for your Provider. Old store will be replaced by the new one."
      );
    }
    this.#store = store;
    this.#setupStore();
    return this;
  }

  #setupStore() {
    const store = this.#store;
    if (!store) {
      throw new Error('For setup store, you should set `store` first.');
    }
    store.getState().providers.addProvider(this.id, this.#configs);
    this.#namespaces.forEach((provider) => {
      provider.store(store);
    });
  }

  #context(): Context {
    return {
      state: this.state.bind(this),
    };
  }
}

export type ProviderBuilderOptions = { store?: Store };
