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

// These are functions that actually has something inside themselves then will call the actual action.
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
  #useCallbacks = new Map<keyof T, AnyFunction>();
  #configs: Partial<NamespaceConfig> = {};

  config<K extends keyof NamespaceConfig>(name: K, value: NamespaceConfig[K]) {
    this.#configs[name] = value;
    return this;
  }

  action<K extends keyof T>(
    action: (readonly [K, FunctionWithContext<T[K], Context>])[]
  ): NamespaceBuilder<T>;

  action<K extends keyof T>(
    action: K,
    cb: FunctionWithContext<T[K], Context>
  ): NamespaceBuilder<T>;

  action<K extends keyof T>(
    action: (readonly [K, FunctionWithContext<T[K], Context>])[] | K,
    cb?: FunctionWithContext<T[K], Context>
  ) {
    if (Array.isArray(action)) {
      action.forEach(([name, cb]) => {
        this.#namespaceActions.set(name, cb);
      });
      return this;
    }
    if (!!cb) {
      this.#namespaceActions.set(action, cb);
    }
    return this;
  }

  /**
   * Provide a list of actions to be called after a **successful** run. (`and` hook)
   *
   * @param list
   * @returns
   */
  use<K extends keyof T>(
    list: (readonly [K, FunctionWithContext<AndFunction<T, K>, Context>])[]
  ) {
    list.forEach(([name, cb]) => {
      this.#useCallbacks.set(name, cb);
    });

    return this;
  }

  subscriber(cb: SubscriberCb) {
    this.#subscribers.add(cb);
    return this;
  }

  build(): NamespaceApi<T> {
    const requiredConfigs: (keyof NamespaceConfig)[] = [
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
    config: Partial<NamespaceConfig>,
    required: (keyof NamespaceConfig)[]
  ): config is NamespaceConfig {
    return required.every((key) => !!config[key]);
  }

  #buildApi(config: NamespaceConfig): NamespaceApi<T> {
    const namespace = new Namespace<T>(
      config,
      this.#namespaceActions,
      this.#subscribers,
      this.#useCallbacks
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
