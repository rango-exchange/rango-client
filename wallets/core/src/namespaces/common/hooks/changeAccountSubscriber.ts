import type {
  Actions,
  SubscriberCleanUp,
} from '../../../hub/namespaces/types.js';
import type { Subscriber } from '../../../mod.js';
import type {
  AutoImplementedActionsByRecommended,
  MustImplementActions,
} from '../types.js';

type Config = {
  invalidEventBehavior?: 'disconnect' | 'reconnect';
};
export class ChangeAccountSubscriberBuilder<EventType, ProviderAPI> {
  #getInstance: (() => ProviderAPI) | null = null;
  #format:
    | ((instance: ProviderAPI, event: EventType) => Promise<string[]>)
    | null = null;
  #validateEventPayload: ((event: EventType) => boolean) | null = null;

  #addEventListener:
    | ((
        instance: ProviderAPI,
        callback: (event: EventType) => void
      ) => (() => void) | void)
    | null = null;
  #removeEventListener:
    | ((instance: ProviderAPI, callback: (event: EventType) => void) => void)
    | null = null;
  #config: Config = {
    invalidEventBehavior: 'disconnect',
  };
  /**
   * Sets the function that provides the provider API instance.
   *
   * @param operator - Function that returns the provider API instance
   * @returns The builder instance for method chaining
   * @example
   * ```typescript
   * builder.getInstance(() => window.ethereum)
   * ```
   */
  public getInstance(operator: () => ProviderAPI) {
    this.#getInstance = operator;
    return this;
  }

  /**
   * Sets the formatter function that converts provider events to account strings.
   *
   * @param operator - Function that takes a provider instance and event, returns array of account strings
   * @returns The builder instance for method chaining
   * @example
   * ```typescript
   * builder.format(async (instance, event) => event.accounts || [])
   * ```
   */
  public format(
    operator: (instance: ProviderAPI, event: EventType) => Promise<string[]>
  ) {
    this.#format = operator;
    return this;
  }

  /**
   * Sets the event payload validation function (optional).
   *
   * @param operator - Function that validates if an event payload is valid
   * @returns The builder instance for method chaining
   * @example
   * ```typescript
   * builder.validateEventPayload(event => !!event)
   * ```
   */
  public validateEventPayload(operator: (event: EventType) => boolean) {
    this.#validateEventPayload = operator;
    return this;
  }

  /**
   * Sets the event listener attachment function.
   *
   * @param operator - Function that attaches an event listener and optionally returns a cleanup function
   * @returns The builder instance for method chaining
   * @example
   * ```typescript
   * builder.addEventListener((instance, callback) => {
   *   return instance.on('accountsChanged', callback);
   * })
   * ```
   */
  public addEventListener(
    operator: (
      instance: ProviderAPI,
      callback: (event: EventType) => void
    ) => (() => void) | void
  ) {
    this.#addEventListener = operator;
    return this;
  }

  /**
   * Sets the event listener removal function.
   *
   * @param operator - Function that removes an event listener from the provider
   * @returns The builder instance for method chaining
   * @example
   * ```typescript
   * builder.removeEventListener((instance, callback) => instance.off('accountsChanged', callback))
   * ```
   */
  public removeEventListener(
    operator: (
      instance: ProviderAPI,
      callback: (event: EventType) => void
    ) => void
  ) {
    this.#removeEventListener = operator;
    return this;
  }

  public setConfig(config: Config) {
    this.#config = { ...this.#config, ...config };
    return this;
  }
  public build<
    ActionsType extends Actions<ActionsType> &
      Actions<AutoImplementedActionsByRecommended> &
      Actions<MustImplementActions>
  >(): [Subscriber<ActionsType>, SubscriberCleanUp<ActionsType>] {
    if (this.#getInstance === null) {
      throw new Error(this.#getErrorMessage('getInstance'));
    }
    if (this.#format === null) {
      throw new Error(this.#getErrorMessage('format'));
    }
    if (this.#addEventListener === null) {
      throw new Error(this.#getErrorMessage('addEventListener'));
    }
    if (this.#removeEventListener === null) {
      throw new Error(this.#getErrorMessage('removeEventListener'));
    }

    /**
     * Capture current operator state at build time to ensure immutability.
     *
     * This creates a snapshot of all operators, preventing the built subscriber
     * from being affected by subsequent changes to the builder instance.
     * Each call to build() gets its own isolated set of operators, allowing
     * the builder to be reused for creating multiple independent subscribers.
     */
    const getInstance = this.#getInstance;
    const format = this.#format;
    const addEventListener = this.#addEventListener;
    const removeEventListener = this.#removeEventListener;
    const validateEventPayload = this.#validateEventPayload;
    let subscriber: (event: EventType) => void;
    let unsubscribe: (() => void) | void;
    const subscriberCleanup: SubscriberCleanUp<ActionsType> = (_, err) => {
      /**
       * Call the cleanup function if addEventListener returned one.
       * This handles providers that return an unsubscribe function from their event listeners.
       */
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
      const instance = getInstance();

      /**
       * Always call removeEventListener as well to handle the on/off pattern.
       * This ensures cleanup works regardless of which pattern the provider uses.
       */
      removeEventListener(instance, subscriber);

      // subscriber can be passed to `or`, it will get the error and should rethrow error to pass the error to next `or` or throw error.
      return err;
    };
    const addSubscriber: Subscriber<ActionsType> = async (context) => {
      const [getState, setState] = context.state();
      const instance = getInstance();

      if (!instance) {
        throw new Error(
          'Trying to subscribe to your wallet, but seems its instance is not available.'
        );
      }
      subscriber = async (event) => {
        if (!!validateEventPayload && !validateEventPayload(event)) {
          if (this.#config.invalidEventBehavior === 'reconnect') {
            if (!getState('connecting')) {
              subscriberCleanup(context);
              await context.action('connect');
            }
          } else {
            context.action('disconnect');
          }

          return;
        }
        setState('accounts', await format(instance, event));
      };
      unsubscribe = addEventListener(instance, subscriber);
    };
    return [addSubscriber, subscriberCleanup];
  }
  #getErrorMessage(operatorName: string) {
    return `Required "${operatorName}" operation has not been set for "changeAccountSubscriber"`;
  }
}
