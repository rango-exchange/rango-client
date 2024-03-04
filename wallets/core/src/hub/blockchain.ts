interface Config {
  id: string;
}

type CommonActionNames = 'connect';
type ActionName = CommonActionNames | Omit<string, CommonActionNames>;
type ActionCb = () => any;
type SubscriberCb = () => () => void;

class BlockchainProvider {
  public readonly id: string;
  private actions: Map<ActionName, ActionCb> = new Map();
  private onActions: Map<ActionName, ActionCb> = new Map();
  private subscriberCleanUps: Set<SubscriberCb> = new Set();

  constructor(config: Config) {
    this.id = config.id;
  }

  action(name: ActionName, cb: ActionCb) {
    this.actions.set(name, cb);
    return this;
  }

  /*
   * if action runs successfuly, then it will run the `cb` fucntion.
   * TODO: This implementation acccepts only one `cb` for each `name`. It's better to be able set multiple `and`.
   */
  and(name: ActionName, cb: ActionCb) {
    this.actions.set(name, cb);
    return this;
  }

  run(name: ActionName) {
    const cb = this.actions.get(name);
    if (!cb) {
      throw new Error(
        `Couldn't find ${name} action. Are you sure you've added the action?`
      );
    }

    let result = cb();
    const thenShouldRun = this.onActions.get(name);
    if (thenShouldRun) {
      result = thenShouldRun(result);
    }
    return cb();
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
}

export { BlockchainProvider };
