import type {
  AnyFunction,
  RemoveThisParameter,
} from '../actions/evm/interface';

type ActionName<K> = K | Omit<K, string>;

type SubscriberCb = () => () => void;
export type State = {
  accounts: null | string[];
  network: null | string;
};
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
  private _state: State;
  private initiated = false;

  constructor(
    namespace: Config['namespace'],
    actions: ActionType<T>,
    subscribers: Set<SubscriberCb>,
    use: Map<keyof T, AnyFunction>
  ) {
    this.namespace = namespace;
    this.actions = actions;
    this.subscribers = subscribers;
    this.andActions = use;

    this._state = {
      accounts: null,
      network: null,
    };
  }

  state(): [GetState, SetState] {
    const setState: SetState = (name, value) => {
      this._state[name] = value;
    };

    const getState: GetState = <K extends keyof State>(name?: K) => {
      if (name) {
        return this._state[name];
      }

      return this._state;
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
}

class BlockchainProviderBuilder<T extends Record<keyof T, AnyFunction>> {
  private configs = new Map<keyof Config, Config[keyof Config]>();
  private actions: ActionType<T> = new Map();
  private subscribers: Set<SubscriberCb> = new Set();
  private useCallbacks = new Map<keyof T, AnyFunction>();

  config<K extends keyof Config>(name: K, value: Config[K]) {
    this.configs.set(name, value);
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
    const namespace = this.configs.get('namespace');
    if (!namespace) {
      throw new Error(
        'You should set an CAIP namespace for your blockchain provider.'
      );
    }

    const blockchainProvider = new BlockchainProvider<T>(
      namespace,
      this.actions,
      this.subscribers,
      this.useCallbacks
    );
    const api = new Proxy(blockchainProvider, {
      get: (_, property) => {
        // TODO: better typing?
        const prop: any = property;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line
        const targetValue = blockchainProvider[prop];

        // These are functions that actually has something inside themselves then will call the actual action.
        const allowedMethods = ['init', 'destroy', 'state', 'after', 'before'];
        if (typeof prop === 'string' && allowedMethods.includes(prop)) {
          return targetValue.bind(blockchainProvider);
        }

        /*
         * This is useful accessing values like `version`, If we don't do this, we should whitelist
         * All the values as well, So it can be confusing for someone that only wants to add a public value to `BlockchainProvider`
         */
        const allowedPublicValues = ['string', 'number'];
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
      Pick<
        BlockchainProvider<T>,
        'init' | 'destroy' | 'state' | 'after' | 'before'
      >;
  }
}

export { BlockchainProvider, BlockchainProviderBuilder };
