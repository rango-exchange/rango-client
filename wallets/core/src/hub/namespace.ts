import type { NamespaceConfig, NamespaceData, Store } from './store';
import type { AnyFunction } from '../actions/evm/interface';

type ActionName<K> = K | Omit<K, string>;

export type SubscriberCb = () => () => void;
export type State = NamespaceData;
type SetState = <K extends keyof State>(name: K, value: State[K]) => void;
type GetState = {
  (): State;
  <K extends keyof State>(name: K): State[K];
};
export type ActionType<T> = Map<ActionName<keyof T>, T[keyof T]>;

export type Context = {
  state: () => [GetState, SetState];
};

interface Config {
  namespace: string;
}

/**
 * Note: This only works native async, if we are going to support for old transpilers like Babel.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function isAsync(fn: Function) {
  return fn.constructor.name === 'AsyncFunction';
}

// TODO: Show a warning if subscribers and subscriberCleanUps doesn't match and call correctly.
class Namespace<T extends Record<keyof T, AnyFunction>> {
  public namespace: Config['namespace'];
  private actions: ActionType<T>;
  private andActions = new Map<keyof T, AnyFunction>();
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
      const state: State = store.getState().namespaces.list[id].data;

      if (!name) {
        return state;
      }

      return state[name];
    };

    return [getState, setState];
  }

  /*
   * if action runs successfuly, then it will run the `cb` fucntion.
   * TODO: This implementation acccepts only one `cb` for each `name`. It's better to be able set multiple `and`.
   */
  and<K extends keyof T>(name: K, cb: AnyFunction) {
    this.andActions.set(name, cb);
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

    const context = {
      state: this.state.bind(this),
    };

    // First run the action (or cb) then tries to run what has been set using `.and`
    const isCbAsync = isAsync(cb);
    const cbWithContext = cb.bind(context);

    const runThen = () => {
      let result = cbWithContext(...args);
      const andAction = this.andActions.get(name);
      const afterAction = this.afterActions.get(name);

      if (andAction) {
        const nextActionWithContext = andAction.bind(context);
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

    const definedInitByUser = this.actions.get('init');
    if (definedInitByUser) {
      definedInitByUser();
    } else {
      console.debug(
        "[Namespace] this blockchain provider doesn't have any `init` implemented."
      );
    }

    // If there is any subscribes, we will call them and they can be cleanUp using destroy.
    this.subscribers.forEach((subscriber) => {
      const cleanUp = subscriber();
      this.subscriberCleanUps.add(cleanUp);
    });

    this.initiated = true;
    console.debug('[Namespace] initiated successfully.');
  }

  after<K extends keyof T>(name: K, cb: AnyFunction) {
    this.afterActions.set(name, cb);
    return this;
  }

  before<K extends keyof T>(name: K, cb: AnyFunction) {
    this.beforeActions.set(name, cb);
    return this;
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
    return `${this.#configs.providerId}$$${this.#configs.namespace}`;
  }
}

export { Namespace };
