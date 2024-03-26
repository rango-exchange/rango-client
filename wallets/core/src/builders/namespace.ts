import type {
  ActionType,
  Context,
  SpecificMethods,
  SubscriberCb,
} from '../hub/namespace';
import type { NamespaceConfig } from '../hub/store';
import type {
  AnyFunction,
  FunctionWithContext,
} from '../namespaces/common/types';

import { Namespace } from '../hub';

// These are functions that actually has something inside themselves then will call the actual action.
const allowedMethods = [
  'init',
  'destroy',
  'state',
  'after',
  'before',
  'store',
] as const;

export type NamespaceApi<T extends SpecificMethods<T>> = T &
  Pick<Namespace<T>, (typeof allowedMethods)[number]>;

export class NamespaceBuilder<T extends SpecificMethods<T>> {
  #namespaceActions: ActionType<T> = new Map();
  #subscribers: Set<SubscriberCb> = new Set();
  #useCallbacks = new Map<keyof T, AnyFunction>();
  #configs: Partial<NamespaceConfig> = {};

  config<K extends keyof NamespaceConfig>(name: K, value: NamespaceConfig[K]) {
    this.#configs[name] = value;
    return this;
  }

  /*
   * TODO: `context` wont be inferred correctly if the `cb` hasn't any params. I was testing it in a unit test.
   * Test case:
   * builder.action([
   *  [
   *    'disconnect',
   *    (context) => {
   *    },
   *  ],
   */
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

  // TODO: Instead of AnyFunction we should somehow infer the return type of T[K] and consider it as the args of `K`
  use<K extends keyof T>(
    list: (readonly [K, FunctionWithContext<AnyFunction, Context>])[]
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

  build() {
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

  #buildApi(config: NamespaceConfig) {
    const namespace = new Namespace<T>(
      config,
      this.#namespaceActions,
      this.#subscribers,
      this.#useCallbacks
    );

    /*
     * This is useful accessing values like `version`, If we don't do this, we should whitelist
     * All the values as well, So it can be confusing for someone that only wants to add a public value to `Namespace`
     */
    const allowedPublicValues = ['string', 'number'];

    const api = new Proxy(namespace, {
      get: (_, property) => {
        // TODO: better typing?
        const prop: any = property;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line
        const targetValue = namespace[prop];

        if (typeof prop === 'string' && allowedMethods.includes(prop as any)) {
          /*
           * TODO: There is a problem with `allowedMethods`.
           * Some of them, they are returning `this` after running, in that case user facing with incorrect interface.
           * e.g:
           *  const blockchain = blockchainBuilder.build().store(store);
           *  blockchain.connect();
           */
          return targetValue.bind(namespace);
        }

        if (
          typeof prop === 'string' &&
          allowedPublicValues.includes(typeof targetValue)
        ) {
          return targetValue;
        }

        return namespace.run.bind(namespace, prop);
      },
      set: () => {
        throw new Error('You can not set anything on this object.');
      },
    });

    return api as unknown as NamespaceApi<T>;
  }
}
