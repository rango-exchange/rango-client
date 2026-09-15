import type { WalletConnectNamespace } from '../types.js';
import type { AppKitNetwork } from '@reown/appkit-common';
import type UniversalProvider from '@walletconnect/universal-provider';

import { createAppKit } from '@reown/appkit/core';

import { bitcoin, mainnet } from './networks.js';

export type AppKitModal = ReturnType<typeof createAppKitModal>;

const DEFAULT_MODAL_Z_INDEX = 999_999_999;

export type ModalParams = {
  projectId: string;
  universalProvider: UniversalProvider;
  themeMode?: 'light' | 'dark';
  zIndex?: number;
};

/*
 * Every WalletConnect namespace shares one AppKit instance with all networks
 * registered up front. A per-namespace instance had to be rebuilt on each
 * switch, and every rebuild re-ran AppKit init against its module-level
 * singleton controllers - leaving router history from the previous open mixed
 * into the next (a stray back button in the modal header). The active network
 * is chosen per connect with `switchNetwork` instead.
 *
 * The active network is now shared mutable state, so this is only safe while
 * connects are serialized (the adapter's `#sessionQueue`): the switch/open/close
 * for one namespace never interleaves with another's. A connect path that
 * bypassed that queue would race this switch.
 */
const NETWORKS: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, bitcoin];

/**
 * The network to make active before opening the modal for a namespace. Keyed by
 * `WalletConnectNamespace` so a future namespace is a compile error until mapped.
 */
const NAMESPACE_NETWORK: Record<WalletConnectNamespace, AppKitNetwork> = {
  evm: mainnet,
  utxo: bitcoin,
};

/**
 * Make a namespace's network active before opening the shared modal.
 *
 * `open()` compares the requested namespace against AppKit's active chain: if
 * they differ it treats the open as a network switch and pushes an extra step
 * onto the router, which leaves a stray back button in the modal header. One
 * shared instance keeps whatever chain the previous connect left active, so we
 * switch it to the target here first - then `open()` sees a matching chain and
 * takes its clean, non-switching path.
 *
 * `ready()` first so AppKit init has registered the networks `switchNetwork`
 * looks up.
 */
export async function prepareModalForNamespace(
  web3Modal: AppKitModal,
  namespace: WalletConnectNamespace
): Promise<void> {
  await web3Modal.ready();
  await web3Modal.switchNetwork(NAMESPACE_NETWORK[namespace]);
}

export function createAppKitModal({
  projectId,
  universalProvider,
  themeMode = 'light',
  zIndex = DEFAULT_MODAL_Z_INDEX,
}: ModalParams) {
  return createAppKit({
    projectId,
    networks: NETWORKS,
    universalProvider,
    /*
     * AppKit is intentionally kept out of the WalletConnect session lifecycle -
     * it renders the modal (QR + wallet list), nothing more. We drive the
     * handshake ourselves with `client.connect()` (see `session/lifecycle.ts`).
     *
     * Why: AppKit models one unified, multi-chain session with a single active
     * chain and its own reconnect/sync. The hub needs the opposite - EVM and
     * UTXO as independent sessions that connect, disconnect and eager-restore
     * separately (the adapter keeps one cache entry per namespace). Letting
     * AppKit drive via `provider.connect()` accumulates namespaces into a single
     * proposal, so connecting BTC after EVM asks the wallet for Ethereum - it was
     * tried and reverted. `manualWCControl: true` is AppKit's supported flag for
     * exactly this "you render, I connect" split.
     *
     * The visible cost: because we own the lifecycle, `provider.session` is never
     * set. With `enableReconnect: false`, AppKit init runs
     * `unSyncExistingConnection()`, whose `provider.disconnect()` hits a
     * `if (!this.session) throw` guard and AppKit logs the caught error as
     * `UniversalAdapter:disconnect - error: Please call connect() before
     * enable()`. It is expected and harmless - AppKit looking for a session to
     * clean up, finding none.
     *
     * Do NOT "fix" the log. Enabling reconnect makes AppKit actively restore/sync
     * connections it doesn't own, racing our own restore path and serialize
     * queue. Assigning `provider.session` removes the guard so that disconnect
     * (and every other AppKit-initiated disconnect) succeeds for real, tearing
     * down a live session on AppKit's schedule instead of ours. Both trade a
     * cosmetic log for real state conflicts.
     */
    enableReconnect: false,
    defaultNetwork: mainnet,
    defaultAccountTypes: { bip122: 'payment' },
    manualWCControl: true,
    /*
     * We register only one EVM network (`mainnet`) but the session approves every
     * EVM chain, so a network switch can land on a chain AppKit considers
     * "unsupported" and it auto-opens its UnsupportedChain modal
     * (ChainController.showUnsupportedChainUI). Allow it so AppKit doesn't police
     * the network we manage ourselves.
     */
    allowUnsupportedChain: true,
    themeMode,
    themeVariables: {
      '--apkt-z-index': zIndex,
    },
  });
}
