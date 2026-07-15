import type { WalletConnectNamespace } from '../types.js';
import type { Chain } from '@hub3js/evm';
import type { SessionTypes } from '@walletconnect/types';
import type UniversalProvider from '@walletconnect/universal-provider';
import type { BlockchainMeta } from 'rango-types';

import { debug } from '@rango-dev/logging-core';

import {
  ensureConnectedToChain as ensureConnectedToChainHelper,
  getCurrentChainId as getCurrentChainIdHelper,
  resolveActiveChainReference as resolveActiveChainReferenceHelper,
  switchEvmNetwork as switchEvmNetworkHelper,
} from '../session/evm-chain.js';
import {
  connectWalletConnectSession,
  prepareWalletConnectNamespace,
} from '../session/lifecycle.js';
import { restoreAndCacheSession } from '../session/restore-cache.js';
import { disconnectWalletConnectSessions } from '../session/teardown.js';
import { evmMetaToCaipChainIds } from '../utils.js';

import { ModalCache } from './modal-cache.js';
import { createUniversalProvider } from './provider-client.js';
import { createSessionCache } from './session-cache.js';

/**
 * Central coordinator for WalletConnect sessions used by hub EVM/UTXO namespaces.
 *
 * Owns provider state (client, session cache, modal) and delegates protocol/domain
 * logic to `session/*` helpers.
 */
export interface WalletConnectAdapterConfig {
  projectId: string;
  meta: BlockchainMeta[];
  disableModalLink?: string;
  themeMode?: 'light' | 'dark';
  modalZIndex?: number;
}

export class WalletConnectAdapter {
  readonly #projectId: string;
  readonly #disableModalLink?: string;
  readonly #themeMode?: 'light' | 'dark';
  readonly #modalZIndex?: number;
  readonly #meta: BlockchainMeta[];
  #universalProvider: UniversalProvider | null = null;
  #universalProviderPromise: Promise<UniversalProvider> | null = null;

  readonly #cache = createSessionCache();
  readonly #modalCache = new ModalCache();

  constructor(config: WalletConnectAdapterConfig) {
    this.#projectId = config.projectId;
    this.#meta = config.meta;
    this.#disableModalLink = config.disableModalLink;
    this.#themeMode = config.themeMode;
    this.#modalZIndex = config.modalZIndex;
  }

  async getUniversalProvider(): Promise<UniversalProvider> {
    /*
     * Memoize the in-flight promise, not the resolved value. A namespace's
     * `before` subscribers are invoked with `forEach` (nothing awaits between
     * them), so several reach this method in the same tick - awaiting first and
     * assigning after would let each start its own `UniversalProvider`, leaving
     * several SignClients sharing one storage. The extra clients answer relay
     * traffic for a handshake they never made ("Pending session not found for
     * topic X", then "No matching key. session topic doesn't exist: X").
     */
    if (!this.#universalProviderPromise) {
      this.#universalProviderPromise = createUniversalProvider(this.#projectId)
        .then((provider) => {
          this.#universalProvider = provider;
          return provider;
        })
        .catch((error: unknown) => {
          // Don't cache a failed init - let the next caller retry.
          this.#universalProviderPromise = null;
          throw error;
        });
    }

    return this.#universalProviderPromise;
  }

  async getClient() {
    return (await this.getUniversalProvider()).client;
  }

  getSession(namespace: WalletConnectNamespace): SessionTypes.Struct | null {
    return this.#cache.get(namespace);
  }

  clearSession(namespace: WalletConnectNamespace) {
    this.#cache.clear(namespace);
  }

  clearAllSessions() {
    this.#cache.clearAll();
  }

  async tryRestoreEagerSession(
    namespace: WalletConnectNamespace
  ): Promise<boolean> {
    const client = await this.getClient();
    return !!(await restoreAndCacheSession(
      client,
      namespace,
      this.#cache,
      { validateAccounts: true },
      async (targetNamespace) => this.disconnectSession(targetNamespace)
    ));
  }

  async ensureSession(options: {
    namespace: WalletConnectNamespace;
    chainReference?: string;
  }): Promise<SessionTypes.Struct> {
    const { namespace, chainReference } = options;
    const client = await this.getClient();
    const restored = await restoreAndCacheSession(
      client,
      namespace,
      this.#cache,
      undefined,
      async (targetNamespace) => this.disconnectSession(targetNamespace)
    );
    if (restored) {
      return restored;
    }

    await prepareWalletConnectNamespace(client, namespace);

    const universalProvider = await this.getUniversalProvider();
    await universalProvider.cleanupPendingPairings().catch(() => undefined);

    const session = await connectWalletConnectSession(
      client,
      this.#modalCache.getModal({
        projectId: this.#projectId,
        namespace,
        universalProvider,
        themeMode: this.#themeMode,
        zIndex: this.#modalZIndex,
      }),
      {
        chains: evmMetaToCaipChainIds(this.#meta),
        envs: {
          WC_PROJECT_ID: this.#projectId,
          DISABLE_MODAL_AND_OPEN_LINK: this.#disableModalLink,
        },
        namespace,
        chainReference,
      },
      { skipCleanup: true }
    );

    this.#cache.set(session);
    return session;
  }

  async disconnectSession(namespace: WalletConnectNamespace) {
    const session = this.getSession(namespace);
    if (this.#universalProvider?.client && session) {
      await disconnectWalletConnectSessions(this.#universalProvider.client, {
        type: 'session',
        session,
      }).catch((error) => debug(error));
    }
    this.clearSession(namespace);
  }

  async disconnectClient() {
    if (this.#universalProvider?.client) {
      await disconnectWalletConnectSessions(this.#universalProvider.client, {
        type: 'all',
      }).catch((error) => debug(error));
    }
    this.clearAllSessions();
  }

  async resolveActiveChainReference(): Promise<string | undefined> {
    const session = this.getSession('evm');
    if (!session) {
      return undefined;
    }

    return resolveActiveChainReferenceHelper(await this.getClient(), session);
  }

  async getCurrentChainId(): Promise<`0x${string}`> {
    const session = this.getSession('evm');
    if (!session) {
      throw new Error(
        'Unable to determine EVM chain id from WalletConnect session.'
      );
    }

    return getCurrentChainIdHelper(await this.getClient(), session);
  }

  async ensureConnectedToChain(
    chain?: string | Chain
  ): Promise<SessionTypes.Struct> {
    return ensureConnectedToChainHelper(this.#evmChainDeps(), chain);
  }

  async switchEvmNetwork(
    requestedChainId: string,
    currentChainId: string
  ): Promise<void> {
    const session = this.getSession('evm');
    if (!session) {
      throw new Error('WalletConnect session is not available.');
    }

    await switchEvmNetworkHelper({
      client: await this.getClient(),
      session,
      meta: this.#meta,
      requestedChainId,
      currentChainId,
    });
  }

  #evmChainDeps() {
    return {
      meta: this.#meta,
      getSession: (namespace: 'evm') => this.getSession(namespace),
      getClient: async () => this.getClient(),
      ensureSession: async (options: {
        namespace: 'evm';
        chainReference?: string;
      }) => this.ensureSession(options),
    };
  }
}
