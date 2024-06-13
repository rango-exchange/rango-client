import type { NamespaceApi } from './types.js';
import type {
  ActionType,
  Context,
  SpecificMethods,
  SubscriberCb,
} from '../hub/namespace.js';
import type { NamespaceConfig } from '../hub/store.js';
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
  'destroy',
  'state',
  'after',
  'before',
  'store',
] as const;

export class NamespaceBuilder<T extends SpecificMethods<T>> {
  #namespaceActions: ActionType<T> = new Map();
  #subscribers: Set<SubscriberCb> = new Set();
  #andUseList = new Map<keyof T, AnyFunction>();
  #configs: Partial<NamespaceConfig> = {};

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
        this.#namespaceActions.set(name, actionFnForItem);
      });
      return this;
    }

    // Single action mode
    if (!!actionFn) {
      this.#namespaceActions.set(action, actionFn);
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
  public andUse<K extends keyof T>(
    list: (readonly [K, FunctionWithContext<AndFunction<T, K>, Context>])[]
  ) {
    list.forEach(([name, cb]) => {
      this.#andUseList.set(name, cb);
    });

    return this;
  }

  /**
   * Subscribers are special actions that will be run on init phase.
   * Each subscriber should have its own cleanup function as well which will be called when a namespace is destroying.
   */
  public subscriber(cb: SubscriberCb) {
    this.#subscribers.add(cb);
    return this;
  }

  /**
   * By calling build, an instance of Namespace will be built.
   *
   * Note: it's not exactly a `Namespace`, it returns a Proxy which add more convenient use like `namespace.connect()` instead of `namespace.run("connect")`
   */
  public build(): NamespaceApi<T> {
    const requiredConfigs: (keyof NamespaceConfig)[] = [
      'namespaceId',
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
    config: Partial<NamespaceConfig>,
    required: (keyof NamespaceConfig)[]
  ): config is NamespaceConfig {
    return required.every((key) => !!config[key]);
  }

  /**
   * Build a Proxy object to call actions in a more convenient way. e.g `.connect()` instead of `.run(connect)`
   */
  #buildApi(config: NamespaceConfig): NamespaceApi<T> {
    const namespace = new Namespace<T>(
      config,
      this.#namespaceActions,
      this.#subscribers,
      this.#andUseList
    );

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

    return api as unknown as NamespaceApi<T>;
  }
}
