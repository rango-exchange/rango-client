interface Config {}

type CommonActionNames = 'connect';
type ActionName = CommonActionNames | Omit<string, CommonActionNames>;
// eslint-disable-next-line @typescript-eslint/ban-types
type ActionCb<T extends Function> = T;
type SubscriberCb = () => () => void;
type State = {
  accounts: null | string[];
  network: null | string;
};
type SetState = <K extends keyof State>(name: K, value: State[K]) => void;
type GetState = <K extends keyof State>(name: K) => State[K];
type ActionType<T> = Map<keyof T, T[keyof T]>;

export type Context = {
  state: () => [GetState, SetState];
};

// eslint-disable-next-line @typescript-eslint/ban-types
class BlockchainProvider<T extends Record<string, Function>> {
  private actions: ActionType<T> = new Map();
  private onActions: ActionType<T> = new Map();
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

    this.actions.set(name, cbWithContext);
    return this;
  }

  /*
   * if action runs successfuly, then it will run the `cb` fucntion.
   * TODO: This implementation acccepts only one `cb` for each `name`. It's better to be able set multiple `and`.
   */
  and<K extends keyof T>(name: K, cb: T[K]) {
    // TODO: this should be moved to a shared variable
    const cbWithContext = cb.bind({
      state: this.state.bind(this),
    });
    this.onActions.set(name, cbWithContext);
    return this;
  }

  use<K extends keyof T>(list: { name: K; cb: T[K] }[]) {
    list.forEach((action) => {
      this.and(action.name, action.cb);
    });

    return this;
  }

  run<K extends keyof T>(name: K) {
    const cb = this.actions.get(name);
    if (!cb) {
      throw new Error(
        `Couldn't find ${name} action. Are you sure you've added the action?`
      );
    }

    console.log({ aaa: this.onActions.get(name), all: this.onActions });

    let result = cb();
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

  build(): T {
    const api = new Proxy(
      {},
      {
        get: (target, property) => {
          if (this.actions.get(property as string)) {
            return this.actions.get(property as string);
          }
          throw new Error("doesn't exists");
        },
        set: () => {
          throw new Error('You can not set anything on this object.');
        },
      }
    );
    return api as T;
  }
}

export { BlockchainProvider };
