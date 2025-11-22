import type {
  Actions,
  Context,
  SubscriberCleanUp,
} from '../../../hub/namespaces/types.js';
import type { Subscriber } from '../../../mod.js';
import type { AutoImplementedActionsByRecommended } from '../types.js';

type OnSwitchAccountEvent<EventType> = {
  payload: EventType;
  preventDefault: () => void;
};

export class ChangeAccountSubscriberBuilder<EventType, ProviderAPI> {
  #getInstance: (() => ProviderAPI) | null = null;
  #format:
    | ((instance: ProviderAPI, event: EventType) => Promise<string[]>)
    | null = null;
  #onSwitchAccount:
    | (<
        ActionsType extends Actions<ActionsType> &
          Actions<AutoImplementedActionsByRecommended>
      >(
        event: OnSwitchAccountEvent<EventType>,
        context: Context<ActionsType>
      ) => void)
    | null = null;

  #addEventListener:
    | ((
        instance: ProviderAPI,
        callback: (event: EventType) => void
      ) => (() => void) | void)
    | null = null;
  #removeEventListener:
    | ((instance: ProviderAPI, callback: (event: EventType) => void) => void)
    | null = null;

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
   * Set a handler that runs whenever a **switch-account** event occurs.
   *
   * The provided operator is called with:
   * - `event`: An object containing:
   *    - `payload`: The event payload associated with the account switch.
   *    - `preventDefault`: A function that prevents the default switch-account
   *       behavior (e.g., updating the active accounts list).
   * - `context`: The execution context of the current flow or action.
   *
   * Calling `event.preventDefault()` inside the handler cancels the built-in
   * account switching logic.
   *
   * @param operator - A function invoked on each switch-account event.
   *   It receives `(event, context)` and can call `event.preventDefault()` to
   *   stop the default behavior.
   *
   * @returns The builder instance for method chaining.
   *
   * @example
   * ```ts
   * builder.onSwitchAccount((event, context) => {
   *   if (!event.payload.userConfirmed) {
   *     event.preventDefault(); // cancel default account switch
   *   }
   *
   *   console.log("Switching account:", event.payload.accountId);
   * });
   * ```
   */
  public onSwitchAccount(
    operator: <
      ActionsType extends Actions<ActionsType> &
        Actions<AutoImplementedActionsByRecommended>
    >(
      event: OnSwitchAccountEvent<EventType>,
      context: Context<ActionsType>
    ) => void
  ) {
    this.#onSwitchAccount = operator;
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
  public build<
    ActionsType extends Actions<ActionsType> &
      Actions<AutoImplementedActionsByRecommended>
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
    const onSwitchAccount = this.#onSwitchAccount;

    let subscriber: (event: EventType) => void;
    let unsubscribe: (() => void) | void;
    return [
      async (context) => {
        const [, setState] = context.state();
        const instance = getInstance();

        if (!instance) {
          throw new Error(
            'Trying to subscribe to your wallet, but seems its instance is not available.'
          );
        }
        subscriber = async (event) => {
          let shouldProceedWithDefault = true;

          onSwitchAccount?.(
            {
              payload: event,
              preventDefault: () => {
                shouldProceedWithDefault = false;
              },
            },
            context
          );
          if (!shouldProceedWithDefault) {
            return;
          }
          setState('accounts', await format(instance, event));
        };
        unsubscribe = addEventListener(instance, subscriber);
      },
      (_, err) => {
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
      },
    ];
  }
  #getErrorMessage(operatorName: string) {
    return `Required "${operatorName}" operation has not been set for "changeAccountSubscriber"`;
  }
}
