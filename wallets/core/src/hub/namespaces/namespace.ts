import type {
  Actions,
  ActionsMap,
  AndUseActions,
  Context,
  GetState,
  SetState,
  State,
} from './types.js';
import type {
  AndFunction,
  AnyFunction,
  FunctionWithContext,
} from '../../namespaces/common/types.js';
import type { NamespaceConfig, Store } from '../store/mod.js';

import { generateStoreId, isAsync } from '../helpers.js';

class Namespace<T extends Actions<T>> {
  public readonly namespaceId: string;
  public readonly providerId: string;

  #actions: ActionsMap<T>;
  #andActions: AndUseActions<T> = new Map();
  // `context` for these two can be Namespace context or Provider context
  #beforeActions = new Map<keyof T, AnyFunction[]>();
  #afterActions = new Map<keyof T, AnyFunction[]>();
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
      configs: NamespaceConfig;
      actions: ActionsMap<T>;
      andUse: AndUseActions<T>;
    }
  ) {
    const { configs, actions, andUse } = options;

    this.namespaceId = id;
    this.providerId = providerId;

    this.#configs = configs;
    this.#actions = actions;
    this.#andActions = andUse;
  }

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

  /*
   * This hook helps us to run a sync function if action ran successfully.
   * For example, if we have a `connect` action, we can add function to be run after `connect` if it ran successfully.
   *
   * TODO: for each action only one `and` can be set right now. that would be great to support more than one `and` action.
   */
  public and<K extends keyof T>(name: K, action: AndFunction<T, K>) {
    this.#andActions.set(name, action);
    return this;
  }

  /**
   * Running a function after a specific
   */
  public after<K extends keyof T, C = unknown>(
    name: K,
    action: FunctionWithContext<AnyFunction, C>,
    options?: { context?: C }
  ) {
    const actionWithContext = options?.context
      ? action.bind(null, options.context)
      : action.bind(null, this.#context() as C);

    const nextAfterActions = this.#afterActions.get(name) || [];
    nextAfterActions.push(actionWithContext);

    this.#afterActions.set(name, nextAfterActions);
    return this;
  }

  public before<K extends keyof T, C = unknown>(
    name: K,
    action: FunctionWithContext<AnyFunction, C>,
    options?: { context?: C }
  ) {
    const actionWithContext = options?.context
      ? action.bind(null, options.context)
      : action.bind(null, this.#context() as C);

    const nextBeforeActions = this.#beforeActions.get(name) || [];
    this.#beforeActions.set(name, nextBeforeActions.concat(actionWithContext));
    return this;
  }

  public run<K extends keyof T>(name: K, ...args: any[]) {
    const action = this.#actions.get(name);

    if (!action) {
      throw new Error(
        `Couldn't find "${name.toString()}" action. Are you sure you've added the action?`
      );
    }
    const beforeActions = this.#beforeActions.get(name);
    if (beforeActions) {
      beforeActions.forEach((beforeAction) => beforeAction());
    }

    const context = this.#context();
    // First run the action (or cb) then tries to run what has been set using `.and`
    const isActionAsync = isAsync(action);
    const actionWithContext = action.bind(null, context);

    const runThen = () => {
      let result = actionWithContext(...args);
      const andAction = this.#andActions.get(name);
      const afterActions = this.#afterActions.get(name);

      if (andAction) {
        const nextActionWithContext = andAction.bind(null, context);
        if (isActionAsync) {
          return result.then(nextActionWithContext).finally(() => {
            if (afterActions) {
              afterActions.forEach((beforeAction) => beforeAction());
            }
          });
        }

        result = nextActionWithContext(result);
      }

      if (afterActions) {
        afterActions.forEach((beforeAction) => beforeAction());
      }
      return result;
    };

    return runThen();
  }

  public init() {
    if (this.#initiated) {
      console.log('[Namespace] initiated already.');
      return;
    }

    const definedInitByUser = this.#actions
      .get('init')
      ?.bind(null, this.#context());
    if (definedInitByUser) {
      definedInitByUser();
    } else {
      console.debug(
        "[Namespace] this namespace doesn't have any `init` implemented."
      );
    }

    this.#initiated = true;
    console.debug('[Namespace] initiated successfully.');
  }

  public store(store: Store) {
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
    store.getState().namespaces.addNamespace(id, {
      namespaceId: this.namespaceId,
      providerId: this.providerId,
    });
  }

  #storeId() {
    return generateStoreId(this.providerId, this.namespaceId);
  }

  #context(): Context {
    return {
      state: this.state.bind(this),
    };
  }
}

export { Namespace };
