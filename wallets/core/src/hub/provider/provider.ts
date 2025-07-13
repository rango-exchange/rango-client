import type {
  CommonNamespaces,
  Context,
  ExtendableInternalActions,
  GetState,
  RegisteredNamespaces,
  SetState,
  State,
} from './types.js';
import type { FindProxiedNamespace } from '../../builders/mod.js';
import type { AnyFunction, FunctionWithContext } from '../../types/actions.js';
import type { ProviderConfig, Store } from '../store/mod.js';

const VERSION = '1.0';

export class Provider {
  public readonly id: string;
  public readonly version = VERSION;

  #namespaces: RegisteredNamespaces<keyof CommonNamespaces, CommonNamespaces>;
  #initiated = false;
  #extendInternalActions: ExtendableInternalActions = {};
  #store: Store | undefined;
  #configs: ProviderConfig;

  constructor(
    id: string,
    namespaces: RegisteredNamespaces<keyof CommonNamespaces, CommonNamespaces>,
    configs: ProviderConfig,
    options?: {
      /**
       * There are some cases we need to have a behavior like initializing a provider which will be run when we are creating an instance.
       * These internal steps and behaviors will be useful for library user to extend the behavior by running a specific code.
       */
      extendInternalActions?: ExtendableInternalActions;
      store?: Store;
    }
  ) {
    this.id = id;
    this.#configs = configs;
    // it should be only created here, to make sure `after/before` will work properly.
    this.#extendInternalActions = options?.extendInternalActions || {};
    this.#namespaces = namespaces;

    /**
     * Our assumption is that the store will be optional for the provider.
     * If a store is provided in the options, it will be initialized and set up.
     */
    if (options?.store) {
      this.#store = options.store;
      this.#setupStore();
    }
  }

  /**
   * This is an special callback that will be called **only once**.
   * We don't call this in `constructor` and developer should call this manually. we only ensure it will be called once.
   *
   * ```ts
   * const myInit = () => {  whatever; }   *
   * const provider = new Provider(..., {extendInternalActions: {init: myInit} });
   *
   * // Will run `myInit`
   * provider.init()
   *
   * // Will not run `myInit` anymore.
   * provider.init()
   * provider.init()
   * ```
   */
  public init(): void {
    if (this.#initiated) {
      return;
    }

    const definedInitByUser = this.#extendInternalActions.init;
    if (definedInitByUser) {
      definedInitByUser(this.#context());
    }

    this.#initiated = true;
  }

  /**
   * Getting state of a provider
   *
   * **Note:**
   *    Each namespace has it's own state as well, in Legacy we didn't have this separation and all of them was accessible through Provider itself
   *    To be compatible with legacy, `getState` has a logic to guess the final state to produce same state as legacy.
   *
   * @example
   * ```ts
   * const provider = new Provider(...);
   * const [getState, setState] = provider.state();
   *
   * getState('installed');
   * // or
   * getState().installed;
   * ```
   *
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

  /**
   * For keeping state, we need a store. all the states will be write to/read from store.
   *
   * **Note: When you are setting an store for provider, it will be set for its namespaces automatically as well**
   *
   * @example
   * ```ts
   * const myStore = createStore();
   * const provider = new Provider(...);
   * provider.store(myStore); // or it can be passed to Provider constructor;
   * ```
   */
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

  /**
   * Getting information about a provider which has been set on constructing Provider.
   *
   * @example
   * ```ts
   * const walletInfo = {name: "Garbage wallet", ...}
   * const provider = new Provider(..., {info: walletInfo});
   *
   * provider.info();
   * ```
   */
  public info(): ProviderConfig | undefined {
    const store = this.#store;
    if (!store) {
      return this.#configs;
    }
    const config = store.getState().providers.list[this.id].config;

    return { metadata: config.metadata, deepLink: config.deepLink };
  }

  /**
   * A list of registered _proxied_ namespaces.
   *
   * @example
   * ```ts
   *  const provider = new Provider(...);
   *  const allNamespaces = provider.getAll();
   * ```
   */
  public getAll(): RegisteredNamespaces<
    keyof CommonNamespaces,
    CommonNamespaces
  > {
    return this.#namespaces;
  }

  /**
   * Get a registered namespace in provider by its **namespace key**.
   *
   * Note: difference between namespace key and namespace id is the first one is setting from a predefined list the second one can be anything and will be chosen by library's user.
   *
   * @param {string} id - evm, solana, cosmos, ... (CommonActions)
   */
  public get<K extends keyof CommonNamespaces>(
    id: K
  ): FindProxiedNamespace<K, CommonNamespaces> | undefined {
    return this.#namespaces.get(id) as unknown as
      | FindProxiedNamespace<K, CommonNamespaces>
      | undefined;
  }

  /**
   *
   * Get a registered namespace by its **namespaceId**.
   *
   * Note: difference between namespace key and namespace id is the first one is setting from a predefined list the second one can be anything and will be chosen by library's user.
   *
   * @example
   * ```ts
   * const provider = new Provider(...);
   * provider.findByNamespace("whatever-id-i-set-for-namespace")
   * ```
   */
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

  /**
   * Running a hook function _after_ a specific action for **all registered namespaces**.
   *
   * **Note:** the context can be set from outside as well. this is useful for Provider to set its context instead of namespace context.
   *
   * @example
   * ```ts
   *  const provider = new Provider(...);
   *
   *  provider.after("connect", (context) => {});
   * ```
   */
  public before(
    actionName: string,
    hookFn: FunctionWithContext<AnyFunction, Context>
  ): this {
    this.#addHook('before', actionName, hookFn);
    return this;
  }

  /**
   * Running a hook function _before_ a specific action for **all registered namespaces**.
   *
   * **Note:** the context can be set from outside as well. this is useful for Provider to set its context instead of namespace context.
   *
   * @example
   * ```ts
   *  const provider = new Provider(...);
   *
   *  provider.after("connect", (context) => {});
   * ```
   */
  public after(
    actionName: string,
    hookFn: FunctionWithContext<AnyFunction, Context>
  ): this {
    this.#addHook('after', actionName, hookFn);
    return this;
  }

  #addHook(
    hookName: 'after' | 'before',
    actionName: string,
    cb: FunctionWithContext<AnyFunction, Context>
  ): this {
    const context = {
      state: this.state.bind(this),
    };

    this.#namespaces.forEach((namespace) => {
      if (hookName === 'after') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        namespace.after(actionName as any, cb, {
          context,
        });
      } else if (hookName === 'before') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        namespace.before(actionName as any, cb, {
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
