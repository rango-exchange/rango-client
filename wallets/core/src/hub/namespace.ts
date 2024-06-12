import type { NamespaceConfig, NamespaceData, Store } from './store.js';
import type {
  AndFunction,
  AnyFunction,
  FunctionWithContext,
} from '../namespaces/common/types.js';

import { generateStoreId, isAsync } from './helpers.js';

type ActionName<K> = K | Omit<K, string>;

export type SubscriberCb = (context: Context) => () => void;
export type State = NamespaceData;
type SetState = <K extends keyof State>(name: K, value: State[K]) => void;
type GetState = {
  (): State;
  <K extends keyof State>(name: K): State[K];
};
export type ActionType<T> = Map<
  ActionName<keyof T>,
  FunctionWithContext<T[keyof T], Context>
>;

export type Context = {
  state: () => [GetState, SetState];
};

interface Config {
  namespace: string;
}

/**
 * This actually define what kind of action will be implemented in namespaces.
 * For example evm namespace will have .connect(chain: string) and .switchNetwork
 * But solana namespace only have: `.connect()`.
 * This actions will be passed to this generic.
 */
export type SpecificMethods<T> = Record<keyof T, AnyFunction>;

/*
 * TODO: Currently, Each hook (`and`, `after`, ...) only accepts one callback.
 * Which means we only can have one `and` hook for `connect` as an example.
 * That would be great to let set more than one cb for any hook.
 */
class Namespace<T extends SpecificMethods<T>> {
  public namespace: Config['namespace'];
  private actions: ActionType<T>;
  private andActions = new Map<keyof T, AnyFunction>();
  // `context` for these two can be Namespace context or Provider context
  private beforeActions = new Map<keyof T, AnyFunction>();
  private afterActions = new Map<keyof T, AnyFunction>();
  private subscribers: Set<SubscriberCb>;
  private subscriberCleanUps: Set<AnyFunction> = new Set();
  private initiated = false;
  #store: Store | undefined;
  #configs: NamespaceConfig;

  constructor(
    config: NamespaceConfig,
    actions: ActionType<T>,
    subscribers: Set<SubscriberCb>,
    use: Map<keyof T, AnyFunction>
  ) {
    this.namespace = config.namespace;
    this.#configs = config;
    this.actions = actions;
    this.subscribers = subscribers;
    this.andActions = use;
  }

  state(): [GetState, SetState] {
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

  /*
   * This hook helps us to run a sync function if action ran successfully.
   * For example, if we have a `connect` action, we can add function to be run after `connect` if it ran successfully.
   *
   */
  and<K extends keyof T>(name: K, cb: AndFunction<T, K>) {
    this.andActions.set(name, cb);
    return this;
  }

  /**
   * Running a function after a specific
   */
  after<K extends keyof T, C = unknown>(
    name: K,
    cb: FunctionWithContext<AnyFunction, C>,
    options?: { context?: C }
  ) {
    const cbWithContext = options?.context
      ? cb.bind(null, options.context)
      : cb.bind(null, this.#context() as C);

    this.afterActions.set(name, cbWithContext);
    return this;
  }

  before<K extends keyof T, C = unknown>(
    name: K,
    cb: FunctionWithContext<AnyFunction, C>,
    options?: { context?: C }
  ) {
    const cbWithContext = options?.context
      ? cb.bind(null, options.context)
      : cb.bind(null, this.#context() as C);
    this.beforeActions.set(name, cbWithContext);
    return this;
  }

  run<K extends keyof T>(name: K, ...args: any[]) {
    const cb = this.actions.get(name);

    if (!cb) {
      throw new Error(
        `Couldn't find "${name.toString()}" action. Are you sure you've added the action?`
      );
    }
    const beforeAction = this.beforeActions.get(name);
    if (beforeAction) {
      beforeAction();
    }

    const context = this.#context();
    // First run the action (or cb) then tries to run what has been set using `.and`
    const isCbAsync = isAsync(cb);
    const cbWithContext = cb.bind(null, context);

    const runThen = () => {
      let result = cbWithContext(...args);
      const andAction = this.andActions.get(name);
      const afterAction = this.afterActions.get(name);

      if (andAction) {
        const nextActionWithContext = andAction.bind(null, context);
        if (isCbAsync) {
          return result.then(nextActionWithContext).finally(afterAction);
        }

        result = nextActionWithContext(result);
      }

      if (afterAction) {
        afterAction();
      }
      return result;
    };

    return runThen();
  }

  destroy() {
    this.subscriberCleanUps.forEach((subscriberCleanUp) => {
      subscriberCleanUp();
      this.subscriberCleanUps.delete(subscriberCleanUp);
    });

    return this;
  }

  init() {
    if (this.initiated) {
      console.log('[Namespace] initiated already.');
      return;
    }

    const definedInitByUser = this.actions
      .get('init')
      ?.bind(null, this.#context());
    if (definedInitByUser) {
      definedInitByUser();
    } else {
      console.debug(
        "[Namespace] this namespace doesn't have any `init` implemented."
      );
    }

    // If there is any subscribes, we will call them and they can be cleanUp using destroy.
    this.subscribers.forEach((subscriber) => {
      const cleanUp = subscriber(this.#context());
      this.subscriberCleanUps.add(cleanUp);
    });

    this.initiated = true;
    console.debug('[Namespace] initiated successfully.');
  }

  store(store: Store) {
    if (this.#store) {
      console.warn(
        "You've already set an store for your Namespace. Old store will be replaced by the new one."
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
    const id = this.#storeId();
    store.getState().namespaces.addNamespace(id, this.#configs);
  }

  #storeId() {
    return generateStoreId(this.#configs.providerId, this.#configs.namespace);
  }

  #context(): Context {
    return {
      state: this.state.bind(this),
    };
  }
}

export { Namespace };
