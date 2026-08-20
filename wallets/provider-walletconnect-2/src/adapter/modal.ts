import type { WalletConnectNamespace } from '../types.js';
import type { AppKitNetwork } from '@reown/appkit-common';
import type UniversalProvider from '@walletconnect/universal-provider';

import { createAppKit } from '@reown/appkit/core';
import { bitcoin, mainnet } from '@reown/appkit/networks';

export type AppKitModal = ReturnType<typeof createAppKitModal>;

const DEFAULT_MODAL_Z_INDEX = 999_999_999;

export type ModalParams = {
  projectId: string;
  namespace: WalletConnectNamespace;
  universalProvider: UniversalProvider;
  themeMode?: 'light' | 'dark';
  zIndex?: number;
};

type NamespaceModalConfig = {
  networks: [AppKitNetwork, ...AppKitNetwork[]];
  defaultNetwork: AppKitNetwork;
  defaultAccountTypes?: Parameters<
    typeof createAppKit
  >[0]['defaultAccountTypes'];
};

/*
 * Per-namespace AppKit network config as a closed-union Record: adding a new
 * `WalletConnectNamespace` is a compile error here until it's configured, so a
 * future namespace can't silently fall into the bitcoin branch.
 */
const MODAL_CONFIG: Record<WalletConnectNamespace, NamespaceModalConfig> = {
  evm: { networks: [mainnet], defaultNetwork: mainnet },
  utxo: {
    networks: [bitcoin],
    defaultNetwork: bitcoin,
    defaultAccountTypes: { bip122: 'payment' },
  },
};

export function createAppKitModal({
  projectId,
  namespace,
  universalProvider,
  themeMode = 'light',
  zIndex = DEFAULT_MODAL_Z_INDEX,
}: ModalParams) {
  const { networks, defaultNetwork, defaultAccountTypes } =
    MODAL_CONFIG[namespace];

  return createAppKit({
    projectId,
    networks,
    universalProvider,
    enableReconnect: false,
    defaultNetwork,
    defaultAccountTypes,
    manualWCControl: true,
    /*
     * We only register `mainnet` with AppKit but the session approves every EVM
     * chain, so any network switch lands on a chain AppKit considers "unsupported"
     * and it auto-opens its UnsupportedChain modal (ChainController.showUnsupportedChainUI).
     * Allow it so AppKit doesn't police the network we manage ourselves.
     */
    allowUnsupportedChain: true,
    themeMode,
    themeVariables: {
      '--apkt-z-index': zIndex,
    },
  });
}
