import type { State as BlockchainState, Namespace } from './namespace';
import type { Provider, State as ProviderState } from './provider';
import type { Store } from './store';

/*
 *
 * Adapter:
 *
 * connect
 * disconnect, disconnectAll
 * suggestAndConnect
 * state
 * canSwitchNetwork
 * providers
 * getWalletInfo
 * getSigners
 *
 * onUpdateState is deprecated, probably by using .use() we can handle it somehow.
 *
 */

type HubState = {
  [key in string]: ProviderState & {
    blockchains: BlockchainState[];
  };
};

type RunAllResult = {
  id: string;
  provider: unknown;
  blockchains: unknown[];
};

interface HubOptions {
  store?: Store;
}
export class Hub {
  #providers = new Map<string, Provider>();
  #options: HubOptions;

  constructor(options?: HubOptions) {
    this.#options = options ?? {};
    /*
     * TODO:
     * config:
     * isEagerConnectEnabled? (warning if explicitly calls eagerConnect)
     *
     */
    this.init();
  }

  init() {
    this.runAll('init');
  }

  // TODO: can we suggest some predefined string using ts?
  runAll(action: string): RunAllResult[] {
    console.log('running all for ', action);
    const output: RunAllResult[] = [];

    // run action on all providers eagerConnect, disconnect
    const providers = this.#providers.values();
    for (const provider of providers) {
      // Calling `action` on `Provider` if exists.

      const providerOutput: RunAllResult = {
        id: provider.id,
        provider: undefined,
        blockchains: [],
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      if (provider[action]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line
        providerOutput.provider = provider[action]();
      }

      // Blockchain instances can have their own `action` as well. we will call them as well.
      const blockchains = provider.getAll().values();
      // blockchains: { id: keyof CommonBlockchains; blockchain: unknown }[];
      for (const blockchain of blockchains) {
        if (blockchain[action]) {
          const result = blockchain[action]();
          providerOutput.blockchains.push(result);
        }
      }

      output.push(providerOutput);
    }

    return output;
  }

  add(id: string, blockchain: Provider) {
    if (this.#options.store) {
      blockchain.store(this.#options.store);
    }

    console.log('[hub]', this.#options);

    this.#providers.set(id, blockchain);
    return this;
  }

  get(providerId: string) {
    return this.#providers.get(providerId);
  }

  getAll() {
    return this.#providers;
  }

  state(): HubState {
    const output = this.runAll('state');
    const res: HubState = {};

    output.forEach((result) => {
      const blockchains: BlockchainState[] = [];
      result.blockchains.forEach((b) => {
        const [getBlockchainState] = b as ReturnType<Namespace<any>['state']>;

        blockchains.push(getBlockchainState());
      });

      const [getProviderState] = result.provider as ReturnType<
        Provider['state']
      >;

      res[result.id] = {
        ...(getProviderState() || {}),
        blockchains: blockchains,
      };
    });
    return res;
  }
}
