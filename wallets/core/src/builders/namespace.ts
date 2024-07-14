import type { ProxiedNamespace } from './types.js';
import type { Action } from '../hub/action/action.js';
import type {
  Actions,
  ActionsMap,
  Context,
  SingleHookActions,
} from '../hub/namespaces/mod.js';
import type { HookActions } from '../hub/namespaces/types.js';
import type { NamespaceConfig } from '../hub/store/mod.js';
import type {
  AndFunction,
  AnyFunction,
  FunctionWithContext,
} from '../namespaces/common/types.js';

import { Namespace } from '../hub/mod.js';

/**
 * There are Namespace's methods that should be called directly on Proxy object.
 * The Proxy object is creating in `.build`.
 */
export const allowedMethods = [
  'init',
  'state',
  'after',
  'before',
  'store',
] as const;

export class NamespaceBuilder<T extends Actions<T>> {
  #id: string;
  #providerId: string;
  #actions: ActionsMap<T> = new Map();
  #andUseList: HookActions<T> = new Map();
  #orUseList: SingleHookActions<T> = new Map();
  #beforeUseList: HookActions<T> = new Map();
  #afterUseList: HookActions<T> = new Map();
  #configs: NamespaceConfig;

  constructor(id: string, providerId: string) {
    this.#id = id;
    this.#providerId = providerId;
    this.#configs = {};
  }

  /** There are some predefined configs that can be set for each namespace separately */
  public config<K extends keyof NamespaceConfig>(
    name: K,
    value: NamespaceConfig[K]
  ) {
    this.#configs[name] = value;
    return this;
  }

  /**
   * Getting a list of actions.
   *
   * e.g.:
   * ```ts
   * .action([
   *      ["connect", () => {}],
   *      ["disconnect", () => {}]
   * ])
   * ```
   *
   */
  public action<K extends keyof T>(
    action: (readonly [K, FunctionWithContext<T[K], Context>])[]
  ): NamespaceBuilder<T>;

  /**
   *
   * Add a single action
   *
   * e.g.:
   * ```ts
   * .action( ["connect", () => {}] )
   * ```
   */
  public action<K extends keyof T>(
    action: K,
    actionFn: FunctionWithContext<T[K], Context>
  ): NamespaceBuilder<T>;

  public action<K extends keyof T>(
    action: InstanceType<typeof Action<T, K>>
  ): NamespaceBuilder<T>;

  /**
   *
   * Actions are piece of functionality that a namespace can have, for example it can be a `connect` function
   * or a sign function or even a function for updating namespace's internal state. Actions are flexible and can be anything.
   *
   * Generally, each standard namespace (e.g. evm) has an standard interface defined in `src/namespaces/`
   * and provider (which includes namespaces) authors will implement those actions.
   *
   * You can call this function by a list of actions or a single action.
   *
   */
  public action<K extends keyof T>(
    action: (readonly [K, FunctionWithContext<T[K], Context>])[] | K,
    actionFn?: FunctionWithContext<T[K], Context>
  ) {
    // List mode
    if (Array.isArray(action)) {
      action.forEach(([name, actionFnForItem]) => {
        this.#actions.set(name, actionFnForItem);
      });
      return this;
    }

    /*
     * Action builder mode
     *
     * TODO:
     *  I don't know why `action instanceof Action` doesn't work.
     *  As a workaround, I'm relying on `actionName` which is available on `Action` class as a public property.
     */

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof action === 'object' && !!action?.actionName) {
      const builtAction = action as InstanceType<typeof Action<T, K>>;
      builtAction.toNamespace(this);

      return this;
    }

    // Single action mode
    if (!!actionFn) {
      this.#actions.set(action, actionFn);
    }

    return this;
  }

  /**
   * Getting a list of `and` functions.
   * Instead of setting `and` one by one, you can put them in a list and use `andUse` to apply them.
   * e.g.
   * ```ts
   * .andUse([
   *    ['connect', () =>{}],
   *    ['disconnect', () =>{}],
   * ])
   * ```
   */
  // TODO: it has a known type problem where a key will be type checked with return type of the whole list (T). see: providers.test.ts at 97
  public andUse<K extends keyof T>(
    list: (readonly [K, FunctionWithContext<AndFunction<T, K>, Context>])[]
  ) {
    list.forEach(([name, cb]) => {
      const ands = this.#andUseList.get(name);
      if (!ands) {
        this.#andUseList.set(name, [cb]);
      } else {
        this.#andUseList.set(name, [...ands, cb]);
      }
    });

    return this;
  }

  public orUse<K extends keyof T>(
    list: (readonly [K, FunctionWithContext<AnyFunction, Context>])[]
  ) {
    list.forEach(([name, cb]) => {
      this.#orUseList.set(name, cb);
    });

    return this;
  }

  public beforeUse<K extends keyof T>(
    list: (readonly [K, FunctionWithContext<AnyFunction, Context>[]])[]
  ) {
    list.forEach(([name, cb]) => {
      this.#beforeUseList.set(name, cb);
    });

    return this;
  }

  public afterUse<K extends keyof T>(
    list: (readonly [K, FunctionWithContext<AnyFunction, Context>[]])[]
  ) {
    list.forEach(([name, cb]) => {
      this.#afterUseList.set(name, cb);
    });

    return this;
  }

  /**
   * By calling build, an instance of Namespace will be built.
   *
   * Note: it's not exactly a `Namespace`, it returns a Proxy which add more convenient use like `namespace.connect()` instead of `namespace.run("connect")`
   */
  public build(): ProxiedNamespace<T> {
    if (this.#isConfigsValid(this.#configs)) {
      return this.#buildApi(this.#configs);
    }

    throw new Error(`You namespace config isn't valid.`);
  }

  // Currently, namespace doesn't has any config.
  #isConfigsValid(_config: NamespaceConfig): boolean {
    return true;
  }

  /**
   * Build a Proxy object to call actions in a more convenient way. e.g `.connect()` instead of `.run(connect)`
   */
  #buildApi(configs: NamespaceConfig): ProxiedNamespace<T> {
    const namespace = new Namespace<T>(this.#id, this.#providerId, {
      configs,
      actions: this.#actions,
      andUse: this.#andUseList,
      orUse: this.#orUseList,
      afterUse: this.#afterUseList,
      beforeUse: this.#beforeUseList,
    });

    const api = new Proxy(namespace, {
      get: (_, property) => {
        if (typeof property !== 'string') {
          throw new Error(
            'You can use string as your property on Namespace instance.'
          );
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line
        const targetValue = namespace[property];

        if (
          allowedMethods.includes(property as (typeof allowedMethods)[number])
        ) {
          return targetValue.bind(namespace);
        }

        /*
         * This is useful accessing values like `version`, If we don't do this, we should whitelist
         * All the values as well, So it can be confusing for someone that only wants to add a public value to `Namespace`
         */
        const allowedPublicValues = ['string', 'number'];
        if (allowedPublicValues.includes(typeof targetValue)) {
          return targetValue;
        }

        return namespace.run.bind(namespace, property as keyof T);
      },
      set: () => {
        throw new Error('You can not set anything on this object.');
      },
    });

    return api as unknown as ProxiedNamespace<T>;
  }
}
