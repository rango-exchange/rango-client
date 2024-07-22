import type {
  Actions,
  ActionsMap,
  Context,
  GetState,
  HookActions,
  HookActionsWithOptions,
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

import {
  ACTION_NOT_FOUND_ERROR,
  NO_STORE_FOUND_ERROR,
  OR_ACTION_FAILED_ERROR,
} from './errors.js';

class Namespace<T extends Actions<T>> {
  public readonly namespaceId: string;
  public readonly providerId: string;

  #actions: ActionsMap<T>;
  #andActions: HookActions<T> = new Map();
  #orActions: HookActions<T> = new Map();
  // `context` for these two can be Namespace context or Provider context
  #beforeActions: HookActionsWithOptions<T> = new Map();
  #afterActions: HookActionsWithOptions<T> = new Map();
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
    }
  ) {
    const { configs, actions } = options;

    this.namespaceId = id;
    this.providerId = providerId;

    this.#configs = configs;
    this.#actions = actions;
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
   */
  public and<K extends keyof T>(
    name: K,
    action: FunctionWithContext<AndFunction<T, K>, Context>
  ) {
    const currentAndActions = this.#andActions.get(name) || [];
    this.#andActions.set(name, currentAndActions.concat(action));

    return this;
  }

  /*
   * If an action fails, a hook action can be called after that which `or`.
   * For example, if we have a `connect` action, we can add function to be run when `connect` fails (throw an error).
   *
   */
  public or<K extends keyof T>(
    name: K,
    action: FunctionWithContext<AnyFunction, Context>
  ) {
    const currentOrActions = this.#orActions.get(name) || [];
    this.#orActions.set(name, currentOrActions.concat(action));

    return this;
  }

  /**
   * Running a function after a specific action
   *
   * Note: the context can be set from outside as well. this is useful for Provider to set its context instead of namespace context.
   */
  public after<K extends keyof T, C = unknown>(
    name: K,
    action: FunctionWithContext<AnyFunction, C>,
    options?: { context?: C }
  ) {
    const currentAfterActions = this.#afterActions.get(name) || [];
    const actionWithOptions = {
      action: action,
      options: {
        context: options?.context,
      },
    };

    this.#afterActions.set(name, currentAfterActions.concat(actionWithOptions));
    return this;
  }

  /**
   * Running a function before a specific action
   *
   * Note: the context can be set from outside as well. this is useful for Provider to set its context instead of using namespace context.
   */
  public before<K extends keyof T, C = unknown>(
    name: K,
    action: FunctionWithContext<AnyFunction, C>,
    options?: { context?: C }
  ) {
    const currentBeforeActions = this.#beforeActions.get(name) || [];
    const actionWithOptions = {
      action: action,
      options: {
        context: options?.context,
      },
    };
    this.#beforeActions.set(
      name,
      currentBeforeActions.concat(actionWithOptions)
    );

    return this;
  }

  public run<K extends keyof T>(
    name: K,
    ...args: any[]
  ): unknown | Promise<unknown> {
    const action = this.#actions.get(name);
    if (!action) {
      throw new Error(ACTION_NOT_FOUND_ERROR(name.toString()));
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
      ? this.#tryRunAsyncAction(name, args)
      : this.#tryRunAction(name, args);

    return result;
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

  #tryRunAction<K extends keyof T>(name: K, params: any[]): unknown {
    this.#tryRunBeforeActions(name);

    const action = this.#actions.get(name);
    if (!action) {
      throw new Error(ACTION_NOT_FOUND_ERROR(name.toString()));
    }

    const context = this.#context();

    let result;
    try {
      result = action(context, ...params);
      result = this.#tryRunAndAction(result, name);
    } catch (e) {
      result = this.#tryRunOrAction(e, name);
    } finally {
      this.#tryRunAfterActions(name);
    }

    return result;
  }

  async #tryRunAsyncAction<K extends keyof T>(
    name: K,
    params: any[]
  ): Promise<unknown> {
    this.#tryRunBeforeActions(name);

    const action = this.#actions.get(name);
    if (!action) {
      throw new Error(ACTION_NOT_FOUND_ERROR(name.toString()));
    }

    const context = this.#context();
    return await action(context, ...params)
      .then((result: unknown) => this.#tryRunAndAction(result, name))
      .catch((e: unknown) => this.#tryRunOrAction(e, name))
      .finally(() => this.#tryRunAfterActions(name));
  }

  #tryRunAfterActions<K extends keyof T>(actionName: K) {
    const afterActions = this.#afterActions.get(actionName);

    if (afterActions) {
      afterActions.forEach((afterAction) => {
        const context = afterAction.options?.context || this.#context();
        afterAction.action(context);
      });
    }
  }

  #tryRunBeforeActions<K extends keyof T>(actionName: K): void {
    const beforeActions = this.#beforeActions.get(actionName);
    if (beforeActions) {
      beforeActions.forEach((beforeAction) => {
        const context = beforeAction.options?.context || this.#context();
        beforeAction.action(context);
      });
    }
  }

  #tryRunAndAction<K extends keyof T>(result: unknown, actionName: K): unknown {
    const andActions = this.#andActions.get(actionName);

    if (andActions) {
      const context = this.#context();
      result = andActions.reduce((prev, andAction) => {
        return andAction(context, prev);
      }, result);
    }
    return result;
  }

  #tryRunOrAction<K extends keyof T>(
    actionError: unknown,
    actionName: K
  ): unknown {
    const orActions = this.#orActions.get(actionName);

    if (orActions) {
      try {
        const context = this.#context();
        return orActions.reduce((prev, orAction) => {
          return orAction(context, prev);
        }, actionError);
      } catch (orError) {
        console.log({ orError });
        throw new Error(OR_ACTION_FAILED_ERROR(actionName.toString()), {
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
