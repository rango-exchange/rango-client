import type {
  Actions,
  SubscriberCleanUp,
} from '../../../hub/namespaces/types.js';
import type { Subscriber } from '../../../mod.js';
import type {
  AutoImplementedActionsByRecommended,
  SupportedProviderTypes,
} from '../types.js';

type Operations<
  EventType,
  ProviderAPI extends SupportedProviderTypes,
  AddEventListenerReturnType
> = {
  getInstance: () => ProviderAPI;
  format: (instance: ProviderAPI, event: EventType) => Promise<string[]>;
  validateEventPayload?: (event: EventType) => boolean;
  addEventListener: (
    instance: ProviderAPI,
    callback: (event: EventType) => void
  ) => AddEventListenerReturnType;
  removeEventListener: (
    instance: ProviderAPI,
    callback: (event: EventType) => void,
    addEventListenerReturn: AddEventListenerReturnType
  ) => void;
};

export class ChangeAccountSubscriberBuilder<
  EventType,
  AddEventListenerReturnType,
  ProviderAPI extends SupportedProviderTypes,
  ActionsType extends Actions<ActionsType> &
    Actions<AutoImplementedActionsByRecommended>
> {
  private operations = {} as Operations<
    EventType,
    ProviderAPI,
    AddEventListenerReturnType
  >;
  private requiredFields: (keyof typeof this.operations)[] = [
    'addEventListener',
    'removeEventListener',
    'format',
    'getInstance',
  ];
  setGetInstance(getInstance: (typeof this.operations)['getInstance']) {
    this.operations.getInstance = getInstance;
    return this;
  }
  setFormat(format: (typeof this.operations)['format']) {
    this.operations.format = format;
    return this;
  }
  setValidateEventPayload(
    validateEventPayload: (typeof this.operations)['validateEventPayload']
  ) {
    this.operations.validateEventPayload = validateEventPayload;
    return this;
  }
  setAddEventListener(
    addEventListener: (typeof this.operations)['addEventListener']
  ) {
    this.operations.addEventListener = addEventListener;
    return this;
  }
  setRemoveEventListener(
    removeEventListener: (typeof this.operations)['removeEventListener']
  ) {
    this.operations.removeEventListener = removeEventListener;
    return this;
  }
  build(): [Subscriber<ActionsType>, SubscriberCleanUp<ActionsType>] {
    for (const field of this.requiredFields) {
      if (!this.operations[field]) {
        throw new Error(
          `Required "${field}" operation has not been set for "changeAccountSubscriber"`
        );
      }
    }

    let eventCallback: (event: EventType) => void;
    let addEventListenerReturn: AddEventListenerReturnType;
    return [
      async (context) => {
        const [, setState] = context.state();
        const instance = this.operations.getInstance();

        if (!instance) {
          throw new Error(
            'Trying to subscribe to your wallet, but seems its instance is not available.'
          );
        }
        eventCallback = async (event) => {
          if (
            !!this.operations.validateEventPayload &&
            !this.operations.validateEventPayload(event)
          ) {
            context.action('disconnect');
            return;
          }
          setState('accounts', await this.operations.format(instance, event));
        };
        addEventListenerReturn = this.operations.addEventListener(
          instance,
          eventCallback
        );
      },
      (_, err) => {
        const instance = this.operations.getInstance();

        this.operations.removeEventListener(
          instance,
          eventCallback,
          addEventListenerReturn
        );

        // subscriber can be passed to `or`, it will get the error and should rethrow error to pass the error to next `or` or throw error.
        return err;
      },
    ];
  }
}
