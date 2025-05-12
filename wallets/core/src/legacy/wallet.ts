import type {
  EagerConnectResult,
  GetInstanceOptions,
  NamespaceData,
  Network,
  WalletActions,
  WalletConfig,
  WalletType,
} from './types.js';
import type { Namespace } from '../namespaces/common/types.js';
import type { BlockchainMeta } from 'rango-types';

import {
  accountAddressesWithNetwork,
  getBlockChainNameFromId,
  needsCheckInstallation,
} from './helpers.js';
import { Events, Networks } from './types.js';
import { eagerConnectHandler } from './utils.js';

export type EventHandler = (
  type: WalletType,
  event: Events,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  coreState: State,
  info: EventInfo
) => void;

export type EventInfo = {
  supportedBlockchains: BlockchainMeta[];
  isContractWallet: boolean;

  // Hub fields
  isHub: boolean;
  // will be set alongside ACCOUNT event
  namespace?: Namespace;
  derivationPath?: string;
};

export interface State {
  connected: boolean;
  connecting: boolean;
  /**
   * @depreacted it always returns `false`. don't use it.
   */
  reachable: boolean;
  installed: boolean;
  accounts: string[] | null;
  network: Network | null;
  derivationPath?: string;
}

export interface Options {
  config: WalletConfig;
  handler: EventHandler;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Wallet<InstanceType = any> {
  public provider: InstanceType | null;
  private actions: WalletActions;
  private state: State;
  private options: Options;
  private info: EventInfo;
  private cleanupSubscribe?: (() => void) | void;

  constructor(options: Options, actions: WalletActions) {
    this.actions = actions;
    this.options = options;
    this.provider = null;
    this.info = {
      supportedBlockchains: [],
      isContractWallet: false,
      isHub: false,
    };
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

  async suggestAndConnect(network: Network) {
    if (this.actions.suggest) {
      await this.actions.suggest({
        instance: this.provider,
        meta: this.info.supportedBlockchains,
        network,
      });
    }
    return await this.connect(network);
  }

  async connect(network?: Network, namespaces?: NamespaceData[]) {
    // If it's connecting, nothing do.
    if (this.state.connecting) {
      throw new Error('Connecting...');
    }

    const connectionFromState = await this.getConnectionFromState();
    const currentNetwork = this.state.network;
    /*
     * If a network hasn't been provided and also we have `lastNetwork`
     * We will use lastNetwork to make sure we will not
     * Ask the user to switch his network wrongly.
     */
    const requestedNetwork =
      network || currentNetwork || this.options.config.defaultNetwork;

    if (connectionFromState) {
      const networkChanged =
        currentNetwork !== requestedNetwork && !!requestedNetwork;

      // Reuse current connection if nothing has changed and we already have the connection in memory.
      if (currentNetwork === requestedNetwork) {
        return connectionFromState;
      }

      let canSwitch = true;
      if (this.actions.canSwitchNetworkTo) {
        canSwitch = this.actions.canSwitchNetworkTo({
          provider: this.provider,
          meta: this.info.supportedBlockchains,
          network: requestedNetwork || '',
        });
      }

      if (networkChanged && canSwitch && !!this.actions.switchNetwork) {
        await this.actions.switchNetwork({
          instance: this.provider,
          meta: this.info.supportedBlockchains,
          // TODO: Fix type error
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          network: requestedNetwork,
          newInstance: this.tryGetInstance.bind(this),
          getState: this.getState.bind(this),
          updateChainId: this.updateChainId.bind(this),
        });

        /*
         * We assume if we reach here (`switchNetwork` not throwing error), Switch successfully has been done.
         * But for providers with async switch network like wallet-connect, we need to wait for chain change
         * event before changing network.
         */
        if (
          requestedNetwork !== this.state.network &&
          !this.options.config.isAsyncSwitchNetwork
        ) {
          this.updateState({
            network,
          });
        }

        return {
          // Only network has been changed, so we reuse accounts from what we have already.
          accounts: connectionFromState.accounts,
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
        meta: this.info.supportedBlockchains || [],
        namespaces,
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
    let nextDerivationPath: string | undefined = undefined;
    if (Array.isArray(connectResult)) {
      let activeEvmNetwork: Network | null = null;
      const accounts = connectResult.flatMap((blockchain) => {
        const chainId = blockchain.chainId || Networks.Unknown;
        // Try to map chainId with a Network, if not found, we use chainId directly.
        const network =
          getBlockChainNameFromId(chainId, this.info.supportedBlockchains) ||
          Networks.Unknown;
        nextDerivationPath = blockchain.derivationPath
          ? blockchain.derivationPath
          : nextDerivationPath;

        /*
         * When connecting to an evm instance, it will return address and wallet's active chain.
         * On switch network we are comparing state's network and what passed as requestedNetwork.
         * This code is for making sure we are setting correct active chain in state if it's evm.
         */
        if (!activeEvmNetwork && network !== Networks.Unknown) {
          const blockchainMeta = this.info.supportedBlockchains.find(
            (blockchain) => blockchain.name === network
          );
          if (blockchainMeta?.info?.infoType === 'EvmMetaInfo') {
            activeEvmNetwork = network;
          }
        }
        // TODO: second parameter should be `string` when we decided to open source the package.
        return accountAddressesWithNetwork(blockchain.accounts, network);
      });
      nextAccounts = accounts.filter(Boolean);
      nextNetwork =
        activeEvmNetwork ||
        requestedNetwork ||
        this.options.config.defaultNetwork;
    } else {
      const chainId = connectResult.chainId || Networks.Unknown;
      const network =
        getBlockChainNameFromId(chainId, this.info.supportedBlockchains) ||
        Networks.Unknown;
      const derivationPath = connectResult.derivationPath;

      // We fallback to current active network if `chainId` not provided.
      nextAccounts = accountAddressesWithNetwork(
        connectResult.accounts,
        network
      );
      nextNetwork = network;
      nextDerivationPath = derivationPath;
    }

    if (nextAccounts.length > 0) {
      this.updateState({
        accounts: nextAccounts,
        network: nextNetwork,
        derivationPath: nextDerivationPath,
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
      void this.actions.disconnect({
        instance: this.provider,
        // On wallet connect, we need to destory the instance and get a whole new instance when we are going to connect
        destroyInstance: () => {
          this.setProvider(null);
        },
      });
    }
  }

  // This method is only used for auto connection
  async eagerConnect(): Promise<EagerConnectResult<InstanceType>> {
    const instance = await this.tryGetInstance({ network: undefined });
    const { canEagerConnect } = this.actions;
    const providerName = this.options.config.type;

    return await eagerConnectHandler({
      canEagerConnect: async () => {
        if (!canEagerConnect) {
          throw new Error(
            `${providerName} provider hasn't implemented canEagerConnect.`
          );
        }

        return await canEagerConnect({
          instance: instance,
          meta: this.info.supportedBlockchains,
        });
      },
      connectHandler: async () => {
        const result = await this.connect();
        return result;
      },
      providerName,
    });
  }

  async getSigners(provider: InstanceType) {
    return await this.actions.getSigners(provider);
  }
  getWalletInfo(allBlockChains: BlockchainMeta[]) {
    return this.actions.getWalletInfo(allBlockChains);
  }
  canSwitchNetworkTo(network: Network, provider: InstanceType) {
    const switchTo = this.actions.canSwitchNetworkTo;
    if (!switchTo) {
      return false;
    }

    return switchTo({
      network,
      meta: this.info.supportedBlockchains,
      provider,
    });
  }

  onInit() {
    // some times functions can be overridden by wallets. see rf-2119
    if (!this.actions.getInstance) {
      throw new Error(
        `Provider hasn't defined how to get wallet's instance. provider: ${this.options.config.type} on: onInit`
      );
    }

    if (!this.options.config.isAsyncInstance) {
      const instance = this.actions.getInstance();
      if (!!instance && !this.state.installed) {
        this.setInstalledAs(true);
      }
    } else if (needsCheckInstallation(this.options)) {
      this.actions.getInstance().then((data: unknown) => {
        if (data) {
          this.setInstalledAs(true);
        }
      });
    }
  }

  setProvider(value: InstanceType | null) {
    this.provider = value;
    if (!!value && !!this.actions.subscribe) {
      const cleanup = this.actions.subscribe({
        instance: value,
        state: this.state,
        meta: this.info.supportedBlockchains,
        connect: this.connect.bind(this),
        disconnect: this.disconnect.bind(this),
        updateAccounts: (accounts, chainId) => {
          let network = this.state.network;
          if (chainId) {
            network =
              getBlockChainNameFromId(
                chainId,
                this.info.supportedBlockchains
              ) || Networks.Unknown;
          }

          const nextAccounts = accountAddressesWithNetwork(accounts, network);
          if (nextAccounts.length > 0) {
            this.updateState({
              accounts: nextAccounts,
            });
          }
        },
        updateChainId: this.updateChainId.bind(this),
      });
      this.cleanupSubscribe = cleanup;
    } else if (!value && this.cleanupSubscribe) {
      this.cleanupSubscribe();
    }
  }

  setInfo(info: Partial<EventInfo>) {
    if (typeof info.supportedBlockchains !== 'undefined') {
      this.info.supportedBlockchains = info.supportedBlockchains;
    }
    if (typeof info.isContractWallet !== 'undefined') {
      this.info.isContractWallet = info.isContractWallet;
    }
  }

  setHandler(handler: EventHandler) {
    this.options.handler = handler;
  }

  getState(): State {
    return this.state;
  }

  updateState(states: Partial<State>) {
    /*
     * We will notify handler after updating all the states.
     * Because when we call `handler` it will has latest states.
     */
    const updates: [Events, unknown][] = [];

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
      this.state.derivationPath = states.derivationPath;
      updates.push([Events.ACCOUNTS, states.accounts]);
    }
    if (typeof states.network !== 'undefined') {
      this.state.network = states.network;
      updates.push([Events.NETWORK, states.network]);
    }

    const state = this.getState();
    updates.forEach(([name, value]) => {
      const eventInfo: EventInfo = {
        supportedBlockchains: this.info.supportedBlockchains,
        isContractWallet: this.info.isContractWallet,
        isHub: false,
      };
      this.options.handler(
        this.options.config.type,
        name,
        value,
        state,
        eventInfo
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

  private async getConnectionFromState() {
    // Already connected, so we return provider that we have in memory.

    /*
     * For switching network on Trust Wallet (WalletConnect),
     * We only kill the session (and not restting the whole state)
     * So we are relying on this.provider for achieving this functionality.
     */
    if (this.state.connected && !!this.provider) {
      return {
        accounts: this.state.accounts,
        network: this.state.network,
        provider: this.provider,
      };
    }

    return null;
  }

  private updateChainId(chainId: string | number) {
    const network = chainId
      ? getBlockChainNameFromId(chainId, this.info.supportedBlockchains)
      : Networks.Unknown;

    this.updateState({
      network,
    });
  }

  private setInstalledAs(value: boolean) {
    if (!needsCheckInstallation(this.options) && value === false) {
      return;
    }

    this.updateState({
      installed: value,
    });
  }
  // eslint-disable-next-line destructuring/in-methods-params
  private async tryGetInstance({
    network,
    force,
  }: {
    network?: Network;
    force?: boolean;
  }) {
    let instance = null;
    /*
     * For switching network on Trust Wallet (WalletConnect),
     * We only kill the session (and not restting the whole state)
     * So we are relying on this.provider for achieving this functionality.
     */
    this.setProvider(null);
    if (this.options.config.isAsyncInstance) {
      // Trying to connect
      const instanceOptions: GetInstanceOptions = {
        currentProvider: this.provider,
        meta: this.info.supportedBlockchains,
        force: force || false,
        updateChainId: this.updateChainId.bind(this),
        getState: this.getState.bind(this),
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
