import type {
  CommonNamespaces,
  Context,
  ExtendableInternalActions,
  GetState,
  NamespacesMap,
  SetState,
  State,
} from './types.js';
import type { FindProxiedNamespace } from '../../builders/mod.js';
import type {
  AnyFunction,
  FunctionWithContext,
} from '../../namespaces/common/types.js';
import type { ProviderConfig, Store } from '../store/mod.js';

const VERSION = '1.0';

export class Provider {
  public readonly id: string;
  public readonly version = VERSION;

  #namespaces: NamespacesMap<keyof CommonNamespaces, CommonNamespaces>;
  #initiated = false;
  #extendInternalActions: ExtendableInternalActions = {};
  #store: Store | undefined;
  #configs: ProviderConfig;

  constructor(
    id: string,
    namespaces: NamespacesMap<keyof CommonNamespaces, CommonNamespaces>,
    configs: ProviderConfig,
    options: {
      /**
       * There are some cases we need to have a behavior like initializing a provider which will be run when we are creating an instance.
       * These internal steps and behaviors will be useful for library user to extend the behavior by running a specific code.
       */
      extendInternalActions: ExtendableInternalActions;
      store?: Store;
    }
  ) {
    this.id = id;
    this.#configs = configs;
    // it should be only created here, to make sure `after/before` will work properly.
    this.#extendInternalActions = options.extendInternalActions;
    this.#namespaces = namespaces;

    if (options.store) {
      this.#store = options.store;
      this.#setupStore();
    }
  }

  /**
   * Getting state of a provider
   *
   * **Note:**
   *    Each namespace has it's own state as well, in Legacy we didn't have this separation and all of them was accessible through Provider itself
   *    To be compatible with legacy, `getState` has a logic to guess the final state to produce same state as legacy.
   */
  public state(): [GetState, SetState] {
    const store = this.#store;
    if (!store) {
      throw new Error(
        `Any store detected for ${this.id}. You need to set your store using '.store' method first.`
      );
    }

    /**
     * State updater
     */
    const setState: SetState = (name, value) => {
      switch (name) {
        case 'installed':
          return store.getState().providers.updateStatus(this.id, name, value);
        default:
          throw new Error(
            `Unhandled state update for provider. (provider id: ${this.id}, state name: ${name})`
          );
      }
    };

    /**
     * State getter
     */
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

  public getAll(): NamespacesMap<keyof CommonNamespaces, CommonNamespaces> {
    return this.#namespaces;
  }

  public get<K extends keyof CommonNamespaces>(
    id: K
  ): FindProxiedNamespace<K, CommonNamespaces> | undefined {
    return this.#namespaces.get(id) as unknown as
      | FindProxiedNamespace<K, CommonNamespaces>
      | undefined;
  }

  public findByNamespace<K extends keyof CommonNamespaces>(
    namespaceLookingFor: K | string
  ): FindProxiedNamespace<K, CommonNamespaces> | undefined {
    // If we didn't found any match, we will return `undefined`.
    let result: object | undefined = undefined;

    this.#namespaces.forEach((namespace) => {
      if (namespace.namespaceId === namespaceLookingFor) {
        result = namespace;
      }
    });

    return result;
  }

  public info(): ProviderConfig['info'] | undefined {
    const store = this.#store;
    if (!store) {
      throw new Error(
        'You need to set your store using `.store` method first.'
      );
    }

    return store.getState().providers.list[this.id].config.info;
  }

  public init(): void {
    const definedInitByUser = this.#extendInternalActions.init;
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

  public before(
    action: string,
    cb: FunctionWithContext<AnyFunction, Context>
  ): this {
    this.#addHook('before', action, cb);
    return this;
  }

  public after(
    action: string,
    cb: FunctionWithContext<AnyFunction, Context>
  ): this {
    this.#addHook('after', action, cb);
    return this;
  }

  public store(store: Store): this {
    if (this.#store) {
      console.warn(
        "You've already set an store for your Provider. Old store will be replaced by the new one."
      );
    }
    this.#store = store;
    this.#setupStore();
    return this;
  }

  #addHook(
    hookName: 'after' | 'before',
    action: string,
    cb: FunctionWithContext<AnyFunction, Context>
  ): this {
    const context = {
      state: this.state.bind(this),
    };

    this.#namespaces.forEach((namespace) => {
      if (hookName === 'after') {
        namespace.after(action as any, cb, {
          context,
        });
      } else if (hookName === 'before') {
        namespace.before(action as any, cb, {
          context,
        });
      } else {
        throw new Error(`You hook name is invalid: ${hookName}`);
      }
    });

    return this;
  }

  #setupStore(): void {
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
