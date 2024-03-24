/* eslint-disable @typescript-eslint/ban-types */
import type { ProviderConfig, Store } from './store';
import type {
  AnyFunction,
  EvmActions,
  RemoveThisParameter,
} from '../actions/evm/interface';
import type { SolanaActions } from '../actions/solana/interface';
import type { State as V1State } from '../v0/wallet';

export type State = Omit<V1State, 'reachable' | 'accounts' | 'network'>;
type SetState = <K extends keyof Pick<State, 'installed'>>(
  name: K,
  value: State[K]
) => void;
type GetState = {
  (): State;
  <K extends keyof State>(name: K): State[K];
};

export interface CommonBlockchains {
  // TODO: I think we don't need `RemoveThisParameter`, because we went the opposite.
  evm: RemoveThisParameter<EvmActions>;
  solana: RemoveThisParameter<SolanaActions>;
  cosmos: string;
}

type Fn = (this: Provider, ...args: any) => any;

interface InternalMethods {
  init?: Fn;
}
export class Provider {
  public id: string;
  public version = '1.0';

  /*
   * TODO:
   * It has some ts erros when I try to type it:
   * Map<keyof CommonBlockchains,CommonBlockchains[keyof CommonBlockchains]>
   */
  #blockchainProviders: Map<any, any>;
  #initiated = false;
  // TODO: better name and also better typing for sure.
  #internalMethods: InternalMethods = {};
  #store: Store | undefined;
  #configs: ProviderConfig;

  constructor(
    id: string,
    blockchains: Map<
      keyof CommonBlockchains,
      CommonBlockchains[keyof CommonBlockchains]
    >,
    configs: ProviderConfig,
    options: {
      internalMethods: InternalMethods;
      store?: Store;
    }
  ) {
    this.id = id;
    this.#configs = configs;
    // it should be only created here, to make sure `after/before` will work properly.
    this.#internalMethods = options.internalMethods;
    this.#blockchainProviders = blockchains;

    if (options.store) {
      this.#store = options.store;
      this.#setupStore();
    }
  }

  state(): [GetState, SetState] {
    const store = this.#store;
    if (!store) {
      throw new Error(
        'You need to set your store using `.store` method first.'
      );
    }

    const setState: SetState = (name, value) => {
      switch (name) {
        case 'installed':
          return store.getState().providers.updateStatus(this.id, name, value);
        default:
          throw new Error('Unhandled state for provider');
      }
    };

    const getState: GetState = <K extends keyof State>(name?: K) => {
      const state: State = {
        installed: store.getState().providers.list[this.id].data.installed,
        // TODO: Not implemented
        connected: false,
        connecting: false,
      };

      if (!name) {
        return state;
      }

      switch (name) {
        case 'installed':
        case 'connected':
        case 'connecting':
          return state[name];
        default:
          throw new Error('Unhandled state for provider');
      }
    };

    return [getState, setState];
  }

  // TODO: Could we somehow type some part of the ReturnType at least?
  getAll() {
    return this.#blockchainProviders;
  }

  get<K extends keyof CommonBlockchains>(id: K): CommonBlockchains[K] {
    return this.#blockchainProviders.get(id);
  }

  // TODO: Could we somehow type some part of the ReturnType at least?
  findBy(options: { namespace?: string }): object | undefined {
    if (options.namespace) {
      // If we didn't found any match, we will return `undefined`.
      let result: object | undefined = undefined;

      this.#blockchainProviders.forEach((blockchainProvider) => {
        if (blockchainProvider.namespace === options.namespace) {
          result = blockchainProvider;
        }
      });

      return result;
    }

    throw new Error('You need to set some filters.');
  }

  info(): ProviderConfig['info'] | undefined {
    const store = this.#store;
    if (!store) {
      throw new Error(
        'You need to set your store using `.store` method first.'
      );
    }

    return store.getState().providers.list[this.id].config.info;
  }

  init() {
    const definedInitByUser = this.#internalMethods.init;
    if (!definedInitByUser) {
      console.debug(
        "[BlockchainProvider] this blockchain provider doesn't have any `init` implemented."
      );
      return;
    }

    if (this.#initiated) {
      console.log('[BlockchainProvider] initiated already.');
      return;
    }

    definedInitByUser.bind(this)();
    this.#initiated = true;
    console.debug('[BlockchainProvider] initiated successfully.');
  }

  before(action: string, cb: AnyFunction) {
    // TODO: `before` and `after` is duplicated
    const context = {
      state: this.state.bind(this),
    };
    const cbWithContext = cb.bind(context);

    this.#blockchainProviders.forEach((blockchainProvider) => {
      blockchainProvider.before(action, cbWithContext);
    });
    return this;
  }

  after(action: string, cb: AnyFunction) {
    const context = {
      state: this.state.bind(this),
    };
    const cbWithContext = cb.bind(context);
    this.#blockchainProviders.forEach((blockchainProvider) => {
      blockchainProvider.after(action, cbWithContext);
    });
    return this;
  }

  store(store: Store) {
    if (this.#store) {
      console.warn(
        "You've already set an store for your Provider. Old store will be replaced by the new one."
      );
    }
    this.#store = store;
    this.#setupStore();
    return this;
  }

  #setupStore() {
    const store = this.#store;
    if (!store) {
      throw new Error('For setup store, you should set `store` first.');
    }
    store.getState().providers.addProvider(this.id, this.#configs);
  }
}

type ProviderBuilderOptions = { store?: Store };
export class ProviderBuilder {
  private id: string;
  private blockchainProviders = new Map();
  private methods: InternalMethods = {};
  #configs: Partial<ProviderConfig> = {};
  #options: Partial<ProviderBuilderOptions>;

  constructor(id: string, options?: ProviderBuilderOptions) {
    this.id = id;
    this.#options = options || {};
  }

  add<K extends keyof CommonBlockchains>(
    id: K,
    blockchain: CommonBlockchains[K]
  ) {
    if (this.#options.store) {
      /*
       * TODO: CommonBlockchains only returning specific interface for each namespace
       * in fact it should return each namespace + default methods on `BlockchainPorivder`
       */

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      blockchain.store(this.#options.store);
    }
    this.blockchainProviders.set(id, blockchain);
    return this;
  }

  config<K extends keyof ProviderConfig>(name: K, value: ProviderConfig[K]) {
    this.#configs[name] = value;
    return this;
  }

  init(cb: Exclude<InternalMethods['init'], undefined>) {
    this.methods.init = cb;
    return this;
  }

  build(): Provider {
    if (this.#isConfigsValid(this.#configs)) {
      return new Provider(this.id, this.blockchainProviders, this.#configs, {
        internalMethods: this.methods,
        store: this.#options.store,
      });
    }

    throw new Error('You need to set all required configs.');
  }

  #isConfigsValid(config: Partial<ProviderConfig>): config is ProviderConfig {
    return !!config.info;
  }
}
