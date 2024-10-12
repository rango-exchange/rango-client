import type {
  Actions,
  Context,
  GetState,
  HooksWithOptions,
  Operators,
  RegisteredActions,
  SetState,
  State,
} from './types.js';
import type {
  AndFunction,
  AnyFunction,
  FunctionWithContext,
} from '../../types/actions.js';
import type { NamespaceConfig, Store } from '../store/mod.js';

import { generateStoreId, isAsync } from '../helpers.js';

import {
  ACTION_NOT_FOUND_ERROR,
  NO_STORE_FOUND_ERROR,
  OR_ELSE_ACTION_FAILED_ERROR,
} from './errors.js';

/**
 *
 * A Namespace is a unit of wallets where usually handles connecting, signing, accounts, ...
 * It will be injected by wallet in its object, for example, `window.phantom.ethereum` or `window.phantom.solana`
 * Each namespace (like solana) has its own functionality which is not shared between all the blockchains.
 * For example in EVM namespaces, you can have different networks (e.g. Ethereum,Polygon, ...) and there are specific flows to handle connecting to them or add a network and etc.
 * But Solana doesn't have this concept and you will directly always connect to solana itself.
 * This is true for signing a transaction, getting information about blockchain and more.
 * So by creating a namespace for each of these, we can define a custom namespace based on blockchain's properties.
 *
 */
class Namespace<T extends Actions<T>> {
  /** it will be used for `store` and accessing to store by its id mainly. */
  public readonly namespaceId: string;
  /** it will be used for `store` and accessing to store by its id mainly. */
  public readonly providerId: string;

  #actions: RegisteredActions<T>;
  #andOperators: Operators<T> = new Map();
  #orOperators: Operators<T> = new Map();
  // `context` for these two can be Namespace context or Provider context
  #beforeHooks: HooksWithOptions<T> = new Map();
  #afterHooks: HooksWithOptions<T> = new Map();

  #initiated = false;
  #store: Store | undefined;
  // Namespace doesn't has any configs now, but we will need the feature in future
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore noUnusedParameters
  #configs: NamespaceConfig;

  constructor(
    id: string,
    providerId: string,
    options: {
      store?: Store;
      configs?: NamespaceConfig;
      actions: RegisteredActions<T>;
    }
  ) {
    const { configs, actions } = options;

    this.namespaceId = id;
    this.providerId = providerId;

    this.#configs = configs || new Map();
    this.#actions = actions;

    if (options.store) {
      this.store(options.store);
    }
  }

  /**
   * This is an special action that will be called **only once**.
   * We don't call this in `constructor` and developer should call this manually. we only ensure it will be called once.
   *
   * ```ts
   * const myInit = () => {  whatever; }
   * const actions = new Map();
   * actions.set("init", myInit)
   * const ns = new Namespace(..., {actions});
   *
   * // Will run `myInit`
   * ns.init()
   *
   * // Will not run `myInit` anymore.
   * ns.init()
   * ns.init()
   * ```
   */
  public init(): void {
    if (this.#initiated) {
      return;
    }

    const definedInitByUser = this.#actions.get('init');

    if (definedInitByUser) {
      definedInitByUser(this.#context());
    }
    // else, this namespace doesn't have any `init` implemented.

    this.#initiated = true;
  }

  /**
   * Reading states from store and also update them.
   *
   * @example
   * ```ts
   * const ns = new Namespace(...);
   * const [getState, setState] = ns.state();
   * ```
   */
  public state(): [GetState, SetState] {
    const store = this.#store;
    if (!store) {
      throw new Error(
        'You need to set your store using `.store` method first.'
      );
    }

    const id = this.#storeId();
    const setState: SetState = (name, value) => {
      store.getState().namespaces.updateStatus(id, name, value);
    };

    const getState: GetState = <K extends keyof State>(name?: K) => {
      const state: State = store.getState().namespaces.getNamespaceData(id);

      if (!name) {
        return state;
      }

      return state[name];
    };

    return [getState, setState];
  }

  /**
   * For keeping state, we need a store. all the states will be write to/read from store.
   *
   * Note: Store can be setup on constructor as well.
   *
   * @example
   * ```ts
   * const myStore = createStore();
   * const ns = new Namespace(...);
   * ns.store(myStore);
   * ```
   */
  public store(store: Store): this {
    if (this.#store) {
      console.warn(
        "You've already set an store for your Namespace. Old store will be replaced by the new one."
      );
    }
    this.#store = store;
    this.#setupStore();

    return this;
  }

  /**
   * It's a boolean operator to run a sync function if action ran successfully.
   * For example, if we have a `connect` action, we can add function to be run after `connect` if it ran successfully.
   *
   * @example
   * ```ts
   *  const ns = new Namespace(..);
   *
   *  ns.and_then('connect', (context) => {
   *    ...
   *  });
   * ```
   *
   */
  public and_then<K extends keyof T>(
    actionName: K,
    operatorFn: FunctionWithContext<AndFunction<T, K>, Context>
  ): this {
    const currentAndOperators = this.#andOperators.get(actionName) || [];
    this.#andOperators.set(actionName, currentAndOperators.concat(operatorFn));

    return this;
  }

  /**
   * It's a boolean operator to run a function to handle when an action fails.
   * For example, if we have a `connect` action, we can add function to be run when `connect` fails (throw an error).
   *
   * @example
   * ```ts
   *  const ns = new Namespace(..);
   *
   *  ns.or_else('connect', (context, error) => {
   *    ...
   *  });
   * ```
   */
  public or_else<K extends keyof T>(
    actionName: K,
    operatorFn: FunctionWithContext<AnyFunction, Context>
  ): this {
    const currentOrOperators = this.#orOperators.get(actionName) || [];
    this.#orOperators.set(actionName, currentOrOperators.concat(operatorFn));

    return this;
  }

  /**
   * Running a function after a specific action
   *
   * Note: the context can be set from outside as well. this is useful for Provider to set its context instead of namespace context.
   *
   * @example
   * ```ts
   *  const ns = new Namespace(...);
   *
   *  ns.after("connect", (context) => {});
   * ```
   */
  public after<K extends keyof T, C = unknown>(
    actionName: K,
    hook: FunctionWithContext<AnyFunction, C>,
    options?: { context?: C }
  ): this {
    const currentAfterHooks = this.#afterHooks.get(actionName) || [];
    const hookWithOptions = {
      hook,
      options: {
        context: options?.context,
      },
    };

    this.#afterHooks.set(actionName, currentAfterHooks.concat(hookWithOptions));
    return this;
  }

  /**
   * Running a function before a specific action
   *
   * Note: the context can be set from outside as well. this is useful for Provider to set its context instead of using namespace context.
   *
   * @example
   * ```ts
   *  const ns = new Namespace(...);
   *
   *  ns.before("connect", (context) => {});
   * ```
   */
  public before<K extends keyof T, C = unknown>(
    actionName: K,
    hook: FunctionWithContext<AnyFunction, C>,
    options?: { context?: C }
  ): this {
    const currentBeforeHooks = this.#beforeHooks.get(actionName) || [];
    const hookWithOptions = {
      hook,
      options: {
        context: options?.context,
      },
    };
    this.#beforeHooks.set(
      actionName,
      currentBeforeHooks.concat(hookWithOptions)
    );

    return this;
  }

  /**
   *
   * Registered actions will be called using `run`. it will run an action and all the operators or hooks that assigned.
   *
   * @example
   * ```ts
   *  const actions = new Map();
   *  actions.set('connect', connectAction);
   *
   *  const ns = new Namespace(NAMESPACE, PROVIDER_ID, {
   *    actions: actions,
   *  });
   *
   *  ns.run("action");
   * ```
   */
  public run<K extends keyof T>(
    actionName: K,
    ...args: any[]
  ): unknown | Promise<unknown> {
    const action = this.#actions.get(actionName);
    if (!action) {
      throw new Error(ACTION_NOT_FOUND_ERROR(actionName.toString()));
    }

    /*
     * Action can be both, sync or async. To simplify the process we can not make `sync` mode to async
     * Since every user's sync action will be an async function and affect what user expect,
     * it makes all the actions async and it doesn't match with Namespace interface (e.g. EvmActions)
     *
     * To avoid this issue and also not duplicating code, I broke the process into smaller methods
     * and two main methods to run actions: tryRunAsyncAction & tryRunAction.
     */
    const result = isAsync(action)
      ? this.#tryRunAsyncAction(actionName, args)
      : this.#tryRunAction(actionName, args);

    return result;
  }

  #tryRunAction<K extends keyof T>(actionName: K, params: any[]): unknown {
    this.#tryRunBeforeHooks(actionName);

    const action = this.#actions.get(actionName);
    if (!action) {
      throw new Error(ACTION_NOT_FOUND_ERROR(actionName.toString()));
    }

    const context = this.#context();

    let result;
    try {
      result = action(context, ...params);
      result = this.#tryRunAndOperators(actionName, result);
    } catch (e) {
      result = this.#tryRunOrOperators(actionName, e);
    } finally {
      this.#tryRunAfterHooks(actionName);
    }

    return result;
  }

  async #tryRunAsyncAction<K extends keyof T>(
    actionName: K,
    params: any[]
  ): Promise<unknown> {
    this.#tryRunBeforeHooks(actionName);

    const action = this.#actions.get(actionName);
    if (!action) {
      throw new Error(ACTION_NOT_FOUND_ERROR(actionName.toString()));
    }

    const context = this.#context();
    return await action(context, ...params)
      .then((result: unknown) => this.#tryRunAndOperators(actionName, result))
      .catch((e: unknown) => this.#tryRunOrOperators(actionName, e))
      .finally(() => this.#tryRunAfterHooks(actionName));
  }

  #tryRunAfterHooks<K extends keyof T>(actionName: K) {
    const afterActions = this.#afterHooks.get(actionName);

    if (afterActions) {
      afterActions.forEach((afterAction) => {
        const context = afterAction.options?.context || this.#context();
        afterAction.hook(context);
      });
    }
  }

  #tryRunBeforeHooks<K extends keyof T>(actionName: K): void {
    const beforeActions = this.#beforeHooks.get(actionName);
    if (beforeActions) {
      beforeActions.forEach((beforeAction) => {
        const context = beforeAction.options?.context || this.#context();
        beforeAction.hook(context);
      });
    }
  }

  #tryRunAndOperators<K extends keyof T>(
    actionName: K,
    result: unknown
  ): unknown {
    const andActions = this.#andOperators.get(actionName);

    if (andActions) {
      const context = this.#context();
      result = andActions.reduce((prev, andAction) => {
        return andAction(context, prev);
      }, result);
    }
    return result;
  }

  #tryRunOrOperators<K extends keyof T>(
    actionName: K,
    actionError: unknown
  ): unknown {
    const orActions = this.#orOperators.get(actionName);

    if (orActions) {
      try {
        const context = this.#context();
        return orActions.reduce((prev, orAction) => {
          return orAction(context, prev);
        }, actionError);
      } catch (orError) {
        throw new Error(OR_ELSE_ACTION_FAILED_ERROR(actionName.toString()), {
          cause: actionError,
        });
      }
    } else {
      throw actionError;
    }
  }

  #setupStore(): void {
    const store = this.#store;
    if (!store) {
      throw new Error(NO_STORE_FOUND_ERROR);
    }

    const id = this.#storeId();
    store.getState().namespaces.addNamespace(id, {
      namespaceId: this.namespaceId,
      providerId: this.providerId,
    });
  }

  #storeId() {
    return generateStoreId(this.providerId, this.namespaceId);
  }

  #context(): Context<T> {
    return {
      state: this.state.bind(this),
      action: this.run.bind(this),
    };
  }
}

export { Namespace };
