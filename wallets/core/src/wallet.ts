import {
  getBlockChainNameFromId,
  Network,
  WalletType,
} from '@rango-dev/wallets-shared';
import { accountAddressesWithNetwork, needsCheckInstallation } from './helpers';
import {
  Events,
  GetInstanceOptions,
  WalletActions,
  WalletConfig,
} from './types';
import type { BlockchainMeta } from 'rango-types';

export type EventHandler = (
  type: WalletType,
  event: Events,
  value: any,
  coreState: State,
  supportedChains: BlockchainMeta[]
) => void;

export interface State {
  connected: boolean;
  connecting: boolean;
  reachable: boolean;
  installed: boolean;
  accounts: string[] | null;
  network: Network | null;
}

export interface Options {
  config: WalletConfig;
  handler: EventHandler;
}

class Wallet<InstanceType = any> {
  private actions: WalletActions;
  private state: State;
  private options: Options;
  private meta: BlockchainMeta[];
  public provider: InstanceType | null;

  constructor(options: Options, actions: WalletActions) {
    this.actions = actions;
    this.options = options;
    this.provider = null;
    this.meta = [];
    this.state = {
      connected: false,
      connecting: false,
      // TODO: Remove
      reachable: false,
      installed: false,
      accounts: null,
      network: null,
    };

    if (!needsCheckInstallation(options)) {
      this.setInstalledAs(true);
    }
  }

  async eagerConnection() {
    // Already connected, so we return provider that we have in memory.

    // For switching network on Trust Wallet (WalletConnect),
    // We only kill the session (and not restting the whole state)
    // So we are relying on this.provider for achieving this functionality.
    if (this.state.connected && !!this.provider) {
      return {
        accounts: this.state.accounts,
        network: this.state.network,
        provider: this.provider,
      };
    }

    // TODO: call actions.eagerConnection
    return null;
  }
  async connect(network?: Network) {
    // If it's connecting, nothing do.
    if (this.state.connecting) {
      throw new Error('Connecting...');
    }

    const eagerConnection = await this.eagerConnection();
    const currentNetwork = this.state.network;
    // If a network hasn't been provided and also we have `lastNetwork`
    // We will use lastNetwork to make sure we will not
    // Ask the user to switch his network wrongly.
    const requestedNetwork =
      network || currentNetwork || this.options.config.defaultNetwork;

    if (eagerConnection) {
      const networkChanged =
        currentNetwork !== requestedNetwork && !!requestedNetwork;

      // Reuse current connection if nothing has changed and we already have the connection in memory.
      if (currentNetwork === requestedNetwork) {
        return eagerConnection;
      }
      if (networkChanged && !!this.actions.switchNetwork) {
        await this.actions.switchNetwork({
          instance: this.provider,
          meta: this.meta,
          // TODO: Fix type error
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          network: requestedNetwork,
          newInstance: this.tryGetInstance.bind(this),
        });

        return {
          // Only network has been changed, so we reuse accounts from what we have already.
          accounts: eagerConnection.accounts,
          network: requestedNetwork,
          provider: this.provider,
        };
      }

      // If none of the above conditions didn't match, continute to connect.
    }

    // We are connecting to wallet for the first time

    // Trying to get wallet's instance, if it's not available, raise an error.
    const instance = await this.tryGetInstance({ network });

    // Instance exists, trying to connect
    this.updateState({
      connecting: true,
    });
    this.setInstalledAs(true);

    try {
      // eslint-disable-next-line no-var
      var connectResult = await this.actions.connect({
        instance,
        network: requestedNetwork || undefined,
        meta: this.meta || [],
      });
    } catch (e) {
      this.resetState();
      throw e;
    }

    this.updateState({
      connected: true,
      reachable: true,
      connecting: false,
    });

    // TODO: Handle accounts.length > 0

    // Inserting accounts into our state.
    let nextAccounts: string[] = [];
    let nextNetwork: Network | null | undefined = null;
    if (Array.isArray(connectResult)) {
      const accounts = connectResult.flatMap((blockchain) => {
        const chainId = blockchain.chainId || Network.Unknown;
        // Try to map chainId with a Network, if not found, we use chainId directly.
        const network =
          getBlockChainNameFromId(chainId, this.meta) || Network.Unknown;
        // TODO: second parameter should be `string` when we decided to open source the package.
        return accountAddressesWithNetwork(
          blockchain.accounts,
          network as Network
        );
      });
      // Typescript can not detect we are filtering out null values:(
      nextAccounts = accounts.filter(Boolean) as string[];
      nextNetwork = requestedNetwork || this.options.config.defaultNetwork;
    } else {
      const chainId = connectResult.chainId || Network.Unknown;
      const network =
        getBlockChainNameFromId(chainId, this.meta) || Network.Unknown;
      // We fallback to current active network if `chainId` not provided.
      nextAccounts = accountAddressesWithNetwork(
        connectResult.accounts,
        network as Network
      );
      nextNetwork = network as Network;
    }

    if (nextAccounts.length > 0) {
      this.updateState({
        accounts: nextAccounts,
        network: nextNetwork,
      });
    }

    return {
      accounts: this.state.accounts,
      network: this.state.network,
      provider: this.provider,
    };
  }

  async disconnect() {
    this.resetState();

    if (this.actions.disconnect) {
      this.actions.disconnect({
        instance: this.provider,
        // On wallet connect, we need to destory the instance and get a whole new instance when we are going to connect
        destroyInstance: () => {
          this.setProvider(null);
        },
      });
    }
  }

  getSigners(provider: any) {
    return this.actions.getSigners(provider);
  }
  getWalletInfo(allBlockChains: BlockchainMeta[]) {
    return this.actions.getWalletInfo(allBlockChains);
  }
  canSwitchNetworkTo(network: Network, provider: any) {
    const switchTo = this.actions.canSwitchNetworkTo;
    if (!switchTo) return false;

    return switchTo({
      network,
      meta: this.meta,
      provider,
    });
  }

  onInit() {
    if (!this.options.config.isAsyncInstance) {
      const instance = this.actions.getInstance();
      if (!!instance && !this.state.installed) {
        this.setInstalledAs(true);
      }
    }
  }

  setProvider(value: any) {
    this.provider = value;
    if (!!value && !!this.actions.subscribe) {
      this.actions.subscribe({
        instance: value,
        state: this.state,
        meta: this.meta,
        connect: this.connect.bind(this),
        disconnect: this.disconnect.bind(this),
        updateAccounts: (accounts, chainId) => {
          let network = this.state.network;
          if (chainId) {
            network =
              getBlockChainNameFromId(chainId, this.meta) || Network.Unknown;
          }

          const nextAccounts = accountAddressesWithNetwork(accounts, network);
          if (nextAccounts.length > 0) {
            this.updateState({
              accounts: nextAccounts,
            });
          }
        },
        updateChainId: (chainId) => {
          const network = chainId
            ? getBlockChainNameFromId(chainId, this.meta)
            : Network.Unknown;
          this.updateState({
            network,
          });
        },
      });
    }
  }

  setMeta(value: BlockchainMeta[]) {
    this.meta = value;
  }

  setHandler(handler: EventHandler) {
    this.options.handler = handler;
  }

  getState(): State {
    return this.state;
  }
  updateState(states: Partial<State>) {
    // We will notify handler after updating all the states.
    // Because when we call `handler` it will has latest states.
    const updates: [Events, any][] = [];

    if (typeof states.connected !== 'undefined') {
      this.state.connected = states.connected;
      updates.push([Events.CONNECTED, states.connected]);
    }
    if (typeof states.connecting !== 'undefined') {
      this.state.connecting = states.connecting;
      updates.push([Events.CONNECTING, states.connecting]);
    }
    if (typeof states.reachable !== 'undefined') {
      this.state.reachable = states.reachable;
      updates.push([Events.REACHABLE, states.reachable]);
    }
    if (typeof states.installed !== 'undefined') {
      this.state.installed = states.installed;
      updates.push([Events.INSTALLED, states.installed]);
    }
    if (typeof states.accounts !== 'undefined') {
      this.state.accounts = states.accounts;
      updates.push([Events.ACCOUNTS, states.accounts]);
    }
    if (typeof states.network !== 'undefined') {
      this.state.network = states.network;
      updates.push([Events.NETWORK, states.network]);
    }

    const state = this.getState();
    updates.forEach(([name, value]) => {
      this.options.handler(
        this.options.config.type,
        name,
        value,
        state,
        this.meta
      );
    });
  }

  resetState() {
    this.updateState({
      connected: false,
      connecting: false,
      reachable: false,
      accounts: null,
      network: null,
    });
  }

  private setInstalledAs(value: boolean) {
    if (!needsCheckInstallation(this.options) && value === false) return;

    this.updateState({
      installed: value,
    });
  }
  private async tryGetInstance({
    network,
    force,
  }: {
    network?: Network;
    force?: boolean;
  }) {
    let instance = null;
    // For switching network on Trust Wallet (WalletConnect),
    // We only kill the session (and not restting the whole state)
    // So we are relying on this.provider for achieving this functionality.
    this.setProvider(null);
    if (this.options.config.isAsyncInstance) {
      // Trying to connect
      const instanceOptions: GetInstanceOptions = {
        currentProvider: this.provider,
        meta: this.meta,
        force: force || false,
        updateChainId: (chainId) => {
          const network = chainId
            ? getBlockChainNameFromId(chainId, this.meta)
            : Network.Unknown;
          this.updateState({
            network,
          });
        },
      };

      if (network) {
        instanceOptions.network = network;
      }
      instance = await this.actions.getInstance(instanceOptions);
    } else {
      instance = this.actions.getInstance();
    }

    if (!instance) {
      this.setInstalledAs(false);
      this.resetState();

      const error_message = `It seems your selected wallet (${this.options.config.type}) isn't installed.`;
      throw new Error(error_message);
    }

    this.setProvider(instance);
    return instance;
  }
}

export default Wallet;
