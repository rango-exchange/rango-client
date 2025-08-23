import type {
  Actions,
  SubscriberCleanUp,
} from '../../../hub/namespaces/types.js';
import type { Subscriber } from '../../../mod.js';
import type {
  AutoImplementedActionsByRecommended,
  SupportedProviderTypes,
} from '../types.js';

type ChangeAccountSubscriberBuilderConfig<
  EventType,
  ProviderAPI extends SupportedProviderTypes,
  AddEventListenerReturnType
> = {
  getInstance: () => ProviderAPI;
  format: (instance: ProviderAPI, event: EventType) => Promise<string[]>;
  shouldItDisconnect: (event: EventType) => boolean;
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
  private config = {} as ChangeAccountSubscriberBuilderConfig<
    EventType,
    ProviderAPI,
    AddEventListenerReturnType
  >;
  setGetInstance(getInstance: (typeof this.config)['getInstance']) {
    this.config.getInstance = getInstance;
    return this;
  }
  setFormat(format: (typeof this.config)['format']) {
    this.config.format = format;
    return this;
  }
  setShouldItDisconnect(
    shouldItDisconnect: (typeof this.config)['shouldItDisconnect']
  ) {
    this.config.shouldItDisconnect = shouldItDisconnect;
    return this;
  }
  setAddEventListener(
    addEventListener: (typeof this.config)['addEventListener']
  ) {
    this.config.addEventListener = addEventListener;
    return this;
  }
  setRemoveEventListener(
    removeEventListener: (typeof this.config)['removeEventListener']
  ) {
    this.config.removeEventListener = removeEventListener;
    return this;
  }
  build(): [Subscriber<ActionsType>, SubscriberCleanUp<ActionsType>] {
    for (const configKey in this.config) {
      if (!this.config[configKey as keyof typeof this.config]) {
        throw new Error(`"${configKey}" has not been set`);
      }
    }

    let eventCallback: (event: EventType) => void;
    let addEventListenerReturn: AddEventListenerReturnType;
    return [
      async (context) => {
        const [, setState] = context.state();
        const instance = this.config.getInstance();

        if (!instance) {
          throw new Error(
            'Trying to subscribe to your wallet, but seems its instance is not available.'
          );
        }
        eventCallback = async (event) => {
          if (this.config.shouldItDisconnect(event)) {
            context.action('disconnect');
            return;
          }
          setState('accounts', await this.config.format(instance, event));
        };
        addEventListenerReturn = this.config.addEventListener(
          instance,
          eventCallback
        );
      },
      (_, err) => {
        const instance = this.config.getInstance();

        this.config.removeEventListener(
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
