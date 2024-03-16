import type {
  AnyFunction,
  RemoveThisParameter,
} from '../actions/evm/interface';

type ActionName<K> = K | Omit<K, string>;

type SubscriberCb = () => () => void;
type State = {
  accounts: null | string[];
  network: null | string;
};
type SetState = <K extends keyof State>(name: K, value: State[K]) => void;
type GetState = <K extends keyof State>(name: K) => State[K];
type ActionType<T> = Map<ActionName<keyof T>, T[keyof T]>;

export type Context = {
  state: () => [GetState, SetState];
};

class BlockchainProvider<T extends Record<keyof T, AnyFunction>> {
  private actions: ActionType<T> = new Map();
  private onActions = new Map<keyof T, AnyFunction>();
  private subscriberCleanUps: Set<SubscriberCb> = new Set();
  private _state: State;

  constructor() {
    this._state = {
      accounts: null,
      network: null,
    };
  }

  state(): [GetState, SetState] {
    const setState: SetState = (name, value) => {
      this._state[name] = value;
    };

    const getState: GetState = (name) => {
      return this._state[name];
    };

    return [getState, setState];
  }

  action<K extends keyof T>(name: K, cb: T[K]) {
    const context = {
      state: this.state,
    };

    const cbWithContext = cb.bind(context);

    this.actions.set(
      name,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      cbWithContext
    );
    return this;
  }

  /*
   * if action runs successfuly, then it will run the `cb` fucntion.
   * TODO: This implementation acccepts only one `cb` for each `name`. It's better to be able set multiple `and`.
   */
  and<K extends keyof T>(name: K, cb: AnyFunction) {
    // TODO: this should be moved to a shared variable
    const cbWithContext = cb.bind({
      state: this.state.bind(this),
    });

    this.onActions.set(name, cbWithContext);
    return this;
  }

  use<K extends keyof T>(list: { name: K; cb: AnyFunction }[]) {
    list.forEach((action) => {
      this.and(action.name, action.cb);
    });

    return this;
  }

  run<K extends keyof T>(name: K, ...args: any[]) {
    const cb = this.actions.get(name);
    if (!cb) {
      throw new Error(
        `Couldn't find ${name.toString()} action. Are you sure you've added the action?`
      );
    }

    let result = cb(...args);
    const thenShouldRun = this.onActions.get(name);
    if (thenShouldRun) {
      result = thenShouldRun(result);
    }
    return result;
  }

  subscriber(cb: SubscriberCb) {
    cb();
    this.subscriberCleanUps.add(cb);
    return this;
  }

  cleanUp() {
    this.subscriberCleanUps.forEach((subscriberCleanUp) => {
      subscriberCleanUp();
      this.subscriberCleanUps.delete(subscriberCleanUp);
    });

    return this;
  }

  countSubscribers() {
    return this.subscriberCleanUps.size;
  }

  build() {
    /*
     * TODO: can we use `this` instead of {}?
     * i guess not, because then we should hide internal methods.
     */
    const api = new Proxy(
      {},
      {
        get: (_, property) => {
          // TODO: better typing?
          const prop = property as any;
          return this.run.bind(this, prop);
          // if (this.actions.get(property as string)) {
          /*
           * }
           * throw new Error("doesn't exists");
           */
        },
        set: () => {
          throw new Error('You can not set anything on this object.');
        },
      }
    );
    return api as RemoveThisParameter<T>;
  }
}

export { BlockchainProvider };
