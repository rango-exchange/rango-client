import type {
  BlockchainProviderConfig,
  BlockchainProviderData,
  Store,
} from './store';
import type {
  AnyFunction,
  RemoveThisParameter,
} from '../actions/evm/interface';

type ActionName<K> = K | Omit<K, string>;

type SubscriberCb = () => () => void;
export type State = BlockchainProviderData;
type SetState = <K extends keyof State>(name: K, value: State[K]) => void;
type GetState = {
  (): State;
  <K extends keyof State>(name: K): State[K];
};
type ActionType<T> = Map<ActionName<keyof T>, T[keyof T]>;

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
class BlockchainProvider<T extends Record<keyof T, AnyFunction>> {
  public namespace: Config['namespace'];
  private actions: ActionType<T>;
  private andActions = new Map<keyof T, AnyFunction>();
  private beforeActions = new Map<keyof T, AnyFunction>();
  private afterActions = new Map<keyof T, AnyFunction>();
  private subscribers: Set<SubscriberCb>;
  private subscriberCleanUps: Set<AnyFunction> = new Set();
  private initiated = false;
  #store: Store | undefined;
  #configs: BlockchainProviderConfig;

  constructor(
    config: BlockchainProviderConfig,
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
      store.getState().blockchainProviders.updateStatus(id, name, value);
    };

    const getState: GetState = <K extends keyof State>(name?: K) => {
      const state: State = store.getState().blockchainProviders.list[id].data;

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
      console.log('[BlockchainProvider] initiated already.');
      return;
    }

    const definedInitByUser = this.actions.get('init');
    if (definedInitByUser) {
      definedInitByUser();
    } else {
      console.debug(
        "[BlockchainProvider] this blockchain provider doesn't have any `init` implemented."
      );
    }

    // If there is any subscribes, we will call them and they can be cleanUp using destroy.
    this.subscribers.forEach((subscriber) => {
      const cleanUp = subscriber();
      this.subscriberCleanUps.add(cleanUp);
    });

    this.initiated = true;
    console.debug('[BlockchainProvider] initiated successfully.');
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
        "You've already set an store for your BlockchainProvider. Old store will be replaced by the new one."
      );
    }
    this.#store = store;

    const id = this.#storeId();
    this.#store
      .getState()
      .blockchainProviders.addBlockchainProvider(id, this.#configs);
    return this;
  }

  #storeId() {
    return `${this.#configs.providerId}$$${this.#configs.namespace}`;
  }
}

class BlockchainProviderBuilder<T extends Record<keyof T, AnyFunction>> {
  private actions: ActionType<T> = new Map();
  private subscribers: Set<SubscriberCb> = new Set();
  private useCallbacks = new Map<keyof T, AnyFunction>();
  #configs: Partial<BlockchainProviderConfig> = {};

  config<K extends keyof BlockchainProviderConfig>(
    name: K,
    value: BlockchainProviderConfig[K]
  ) {
    this.#configs[name] = value;
    return this;
  }

  action<K extends keyof T>(name: K, cb: T[K]) {
    this.actions.set(name, cb);
    return this;
  }

  use<K extends keyof T>(list: { name: K; cb: AnyFunction }[]) {
    list.forEach((action) => {
      this.useCallbacks.set(action.name, action.cb);
    });

    return this;
  }

  subscriber(cb: SubscriberCb) {
    this.subscribers.add(cb);
    return this;
  }

  build() {
    const requiredConfigs: (keyof BlockchainProviderConfig)[] = [
      'namespace',
      'providerId',
    ];

    if (this.#isConfigsValid(this.#configs, requiredConfigs)) {
      return this.#buildApi(this.#configs);
    }

    throw new Error(
      `You need to set all required configs. required fields: ${requiredConfigs.join(
        ', '
      )}`
    );
  }

  #isConfigsValid(
    config: Partial<BlockchainProviderConfig>,
    required: (keyof BlockchainProviderConfig)[]
  ): config is BlockchainProviderConfig {
    return required.every((key) => !!config[key]);
  }

  #buildApi(config: BlockchainProviderConfig) {
    const blockchainProvider = new BlockchainProvider<T>(
      config,
      this.actions,
      this.subscribers,
      this.useCallbacks
    );

    // These are functions that actually has something inside themselves then will call the actual action.
    const allowedMethods: readonly (keyof BlockchainProvider<T>)[] = [
      'init',
      'destroy',
      'state',
      'after',
      'before',
      'store',
    ];

    /*
     * This is useful accessing values like `version`, If we don't do this, we should whitelist
     * All the values as well, So it can be confusing for someone that only wants to add a public value to `BlockchainProvider`
     */
    const allowedPublicValues = ['string', 'number'];

    const api = new Proxy(blockchainProvider, {
      get: (_, property) => {
        // TODO: better typing?
        const prop: any = property;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line
        const targetValue = blockchainProvider[prop];

        if (typeof prop === 'string' && allowedMethods.includes(prop as any)) {
          /*
           * TODO: There is a problem with `allowedMethods`.
           * Some of them, they are returning `this` after running, in that case user facing with incorrect interface.
           * e.g:
           *  const blockchain = blockchainBuilder.build().store(store);
           *  blockchain.connect();
           */
          return targetValue.bind(blockchainProvider);
        }

        if (
          typeof prop === 'string' &&
          allowedPublicValues.includes(typeof targetValue)
        ) {
          return targetValue;
        }

        return blockchainProvider.run.bind(blockchainProvider, prop);
      },
      set: () => {
        throw new Error('You can not set anything on this object.');
      },
    });
    return api as RemoveThisParameter<T> &
      Pick<BlockchainProvider<T>, (typeof allowedMethods)[number]>;
  }
}

export { BlockchainProvider, BlockchainProviderBuilder };
