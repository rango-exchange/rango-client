import type {
  AnyFunction,
  FunctionWithContext,
} from '../actions/evm/interface';
import type { ActionType, Context, SubscriberCb } from '../hub/namespace';
import type { NamespaceConfig } from '../hub/store';

import { Namespace } from '../hub';

export class NamespaceBuilder<T extends Record<keyof T, AnyFunction>> {
  private actions: ActionType<T> = new Map();
  private subscribers: Set<SubscriberCb> = new Set();
  private useCallbacks = new Map<keyof T, AnyFunction>();
  #configs: Partial<NamespaceConfig> = {};

  config<K extends keyof NamespaceConfig>(name: K, value: NamespaceConfig[K]) {
    this.#configs[name] = value;
    return this;
  }

  action<K extends keyof T>(name: K, cb: FunctionWithContext<T[K], Context>) {
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
      this.actions,
      this.subscribers,
      this.useCallbacks
    );

    // These are functions that actually has something inside themselves then will call the actual action.
    const allowedMethods: readonly (keyof Namespace<T>)[] = [
      'init',
      'destroy',
      'state',
      'after',
      'before',
      'store',
    ];

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
    return api as unknown as T &
      Pick<Namespace<T>, (typeof allowedMethods)[number]>;
  }
}
