import type { WalletType } from '@hub3js/core';
import type { Namespace } from '@hub3js/namespaces';
import type {
  EventHandler,
  NamespaceInputForConnect,
} from '@rango-dev/wallets-react';
import type { BlockchainMeta } from 'rango-sdk';

import { getBlockChainNameFromId } from '@rango-dev/internal-blockchains';
import { WalletTypes } from '@rango-dev/provider-all';
import { Events } from '@rango-dev/wallets-react';
import { AccountId } from 'caip';
import { isEvmBlockchain } from 'rango-sdk';

import { WalletEventTypes } from '../types';
import { emitWalletEvent } from '../utils/events';

interface TrackedWallet {
  connected: boolean;
  namespaces: Set<Namespace>;
  networks: Map<Namespace, string>;
  addresses: Map<Namespace, Set<string>>;
}

/*
 * Module-scoped so `detected` fires at most once per wallet per session, even
 * when a provider is detected again or the widget remounts.
 */
const detectedWallets = new Set<WalletType>();

/*
 * Wallets that aren't browser-injected extensions; their presence doesn't mean
 * a wallet is installed, so they never fire `detected`.
 */
const NON_INJECTED_WALLET_TYPES = new Set<string>([
  WalletTypes.LEDGER,
  WalletTypes.TREZOR,
  WalletTypes.WALLET_CONNECT_2,
  WalletTypes.TON_CONNECT,
  WalletTypes.DEFAULT,
]);

function walletPayload(walletType: WalletType) {
  return { walletType, walletName: walletType };
}

function namespacePayload(walletType: WalletType, namespace: Namespace) {
  return { ...walletPayload(walletType), namespace };
}

// Addresses without their chain, so an EVM network switch isn't an account switch.
function toAddresses(accounts: string[] | null): Set<string> {
  return new Set(
    (accounts ?? []).map((account) => AccountId.parse(account).address)
  );
}

function haveSameItems(a: Set<string>, b: Set<string>): boolean {
  return a.size === b.size && [...a].every((item) => b.has(item));
}

/*
 * Turns every wallets-react update into the widget's wallet-level and
 * namespace-level connection events. `connect`/`disconnect` follow the
 * wallet's own connected state (not namespace bookkeeping).
 */
export class WalletAnalyticsTracker {
  #wallets = new Map<WalletType, TrackedWallet>();

  handleWalletsReactUpdate: EventHandler = (
    walletType,
    event,
    value,
    coreState,
    info
  ) => {
    switch (event) {
      case Events.CONNECTED:
        if (value) {
          this.#connectWallet(walletType);
        } else {
          this.#markWalletDisconnected(walletType);
        }
        break;
      case Events.ACCOUNTS:
        if (!info.namespace) {
          break;
        }
        if (this.#wallets.get(walletType)?.namespaces.has(info.namespace)) {
          this.#updateAccounts(walletType, info.namespace, coreState.accounts);
        } else if (Array.isArray(value) && value.length > 0) {
          this.#connectNamespace(
            walletType,
            info.namespace,
            coreState.accounts
          );
        }
        break;
      case Events.NAMESPACE_DISCONNECTED:
        // accounts still set: hub3 account switch, not a disconnect
        if (info.namespace && !coreState.accounts?.length) {
          this.#disconnectNamespace(walletType, info.namespace);
        }
        break;
      case Events.PROVIDER_DISCONNECTED:
        this.#disconnectWallet(walletType);
        break;
      case Events.NETWORK:
        if (
          info.namespace &&
          (typeof value === 'string' || typeof value === 'number')
        ) {
          this.#recordNetwork(
            walletType,
            info.namespace,
            value,
            info.supportedBlockchains
          );
        }
        break;
      case Events.CONNECTING:
        if (value === true) {
          this.#initiateConnect(walletType);
        }
        break;
      case Events.INSTALLED:
        if (value) {
          this.#detectWallet(walletType);
        }
        break;
      case Events.REACHABLE:
        break;
    }
  };

  /** Called right before the widget asks a wallet to connect `namespaces`. */
  handleConnectRequest(
    walletType: WalletType,
    namespaces?: NamespaceInputForConnect[]
  ): void {
    const connectedNamespaces = this.#wallets.get(walletType)?.namespaces;
    namespaces?.forEach(({ namespace }) => {
      if (!connectedNamespaces?.has(namespace)) {
        emitWalletEvent({
          type: WalletEventTypes.NAMESPACE_CONNECT_INITIATED,
          payload: namespacePayload(walletType, namespace),
        });
      }
    });
  }

  /** `network` is the requested network, as a Rango blockchain name. */
  handleNetworkSuggestion(
    walletType: WalletType,
    target: { namespace: Namespace; network: string }
  ): void {
    emitWalletEvent({
      type: WalletEventTypes.NETWORK_SUGGESTED,
      payload: {
        ...namespacePayload(walletType, target.namespace),
        network: target.network,
      },
    });
  }

  #getOrCreateWallet(walletType: WalletType): TrackedWallet {
    let wallet = this.#wallets.get(walletType);
    if (!wallet) {
      wallet = {
        connected: false,
        namespaces: new Set(),
        networks: new Map(),
        addresses: new Map(),
      };
      this.#wallets.set(walletType, wallet);
    }
    return wallet;
  }

  #initiateConnect(walletType: WalletType): void {
    if (this.#wallets.get(walletType)?.connected) {
      return;
    }
    emitWalletEvent({
      type: WalletEventTypes.CONNECT_INITIATED,
      payload: walletPayload(walletType),
    });
  }

  #detectWallet(walletType: WalletType): void {
    if (
      NON_INJECTED_WALLET_TYPES.has(walletType) ||
      detectedWallets.has(walletType)
    ) {
      return;
    }
    detectedWallets.add(walletType);
    emitWalletEvent({
      type: WalletEventTypes.DETECTED,
      payload: { walletName: walletType },
    });
  }

  #connectWallet(walletType: WalletType): void {
    const wallet = this.#getOrCreateWallet(walletType);
    if (wallet.connected) {
      return;
    }
    wallet.connected = true;
    emitWalletEvent({
      type: WalletEventTypes.CONNECT,
      payload: walletPayload(walletType),
    });
  }

  #markWalletDisconnected(walletType: WalletType): void {
    const wallet = this.#wallets.get(walletType);
    if (wallet) {
      wallet.connected = false;
    }
  }

  #connectNamespace(
    walletType: WalletType,
    namespace: Namespace,
    accounts: string[] | null
  ): void {
    const wallet = this.#getOrCreateWallet(walletType);
    wallet.namespaces.add(namespace);
    wallet.addresses.set(namespace, toAddresses(accounts));
    emitWalletEvent({
      type: WalletEventTypes.NAMESPACE_CONNECTED,
      payload: namespacePayload(walletType, namespace),
    });
  }

  #disconnectNamespace(walletType: WalletType, namespace: Namespace): void {
    const wallet = this.#wallets.get(walletType);
    if (!wallet || !wallet.namespaces.has(namespace)) {
      return;
    }
    wallet.namespaces.delete(namespace);
    wallet.networks.delete(namespace);
    wallet.addresses.delete(namespace);
    emitWalletEvent({
      type: WalletEventTypes.NAMESPACE_DISCONNECTED,
      payload: namespacePayload(walletType, namespace),
    });
  }

  /*
   * The first network a connected namespace reports (the one it got while
   * connecting) is only recorded; a later different one is a network switch.
   */
  #recordNetwork(
    walletType: WalletType,
    namespace: Namespace,
    value: string | number,
    blockchains: BlockchainMeta[]
  ): void {
    const wallet = this.#wallets.get(walletType);
    if (!wallet || !wallet.namespaces.has(namespace)) {
      return;
    }
    const network =
      getBlockChainNameFromId(value, blockchains.filter(isEvmBlockchain)) ??
      String(value);
    const previousNetwork = wallet.networks.get(namespace);
    wallet.networks.set(namespace, network);
    if (previousNetwork !== undefined && previousNetwork !== network) {
      emitWalletEvent({
        type: WalletEventTypes.SWITCH_NETWORK,
        payload: {
          ...namespacePayload(walletType, namespace),
          network,
        },
      });
    }
  }

  #disconnectWallet(walletType: WalletType): void {
    const wallet = this.#wallets.get(walletType);
    if (!wallet) {
      return;
    }
    this.#wallets.delete(walletType);
    wallet.namespaces.forEach((namespace) => {
      emitWalletEvent({
        type: WalletEventTypes.NAMESPACE_DISCONNECTED,
        payload: namespacePayload(walletType, namespace),
      });
    });
    if (wallet.connected) {
      emitWalletEvent({
        type: WalletEventTypes.DISCONNECT,
        payload: walletPayload(walletType),
      });
    }
  }

  #updateAccounts(
    walletType: WalletType,
    namespace: Namespace,
    accounts: string[] | null
  ): void {
    const wallet = this.#getOrCreateWallet(walletType);
    const addresses = toAddresses(accounts);
    const previousAddresses = wallet.addresses.get(namespace);
    wallet.addresses.set(namespace, addresses);
    if (previousAddresses && !haveSameItems(previousAddresses, addresses)) {
      emitWalletEvent({
        type: WalletEventTypes.SWITCH_ACCOUNT,
        payload: namespacePayload(walletType, namespace),
      });
    }
  }
}
