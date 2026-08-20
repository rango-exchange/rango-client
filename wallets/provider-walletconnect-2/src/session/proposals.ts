import type { WalletConnectNamespace } from '../types.js';
import type { ProposalTypes } from '@walletconnect/types';
import type { ChainIdParams } from 'caip';

import { CAIP_BITCOIN_CHAIN_ID } from '@rango-dev/wallets-core/namespaces/utxo';
import { ChainId } from 'caip';

import {
  DEFAULT_BITCOIN_EVENTS,
  DEFAULT_BITCOIN_METHODS,
  DEFAULT_ETHEREUM_EVENTS,
  DEFAULT_ETHEREUM_METHODS,
  NAMESPACES,
  WC_NAMESPACE_TO_CAIP,
} from '../wcConstants.js';

/**
 * `chains` is required here so the same shape is assignable both to the
 * SignClient `ProposalTypes` (chains optional) and to the UniversalProvider
 * `NamespaceConfig` (chains required).
 */
export type FinalNamespaces = Record<
  string,
  { chains: string[]; methods: string[]; events: string[] }
>;

export type ConnectNamespacePayload = {
  requiredNamespaces: ProposalTypes.RequiredNamespaces;
  optionalNamespaces: ProposalTypes.OptionalNamespaces;
};

type NamespaceProposal = {
  methods: string[];
  events: string[];
  resolveChains: (
    chains: ChainIdParams[],
    targetChainReference?: string
  ) => ChainIdParams[];
};

/**
 * Per-namespace proposal facts as data, keyed by `WalletConnectNamespace` so a
 * newly-added alias is a compile error until it's configured here. The CAIP
 * prefix comes from the shared `WC_NAMESPACE_TO_CAIP` map.
 */
const NAMESPACE_PROPOSALS: Record<WalletConnectNamespace, NamespaceProposal> = {
  evm: {
    methods: DEFAULT_ETHEREUM_METHODS,
    events: DEFAULT_ETHEREUM_EVENTS,
    resolveChains: (chains, targetChainReference) => {
      if (targetChainReference) {
        return [
          { namespace: NAMESPACES.ETHEREUM, reference: targetChainReference },
        ];
      }
      return chains.length > 0
        ? chains
        : [{ namespace: NAMESPACES.ETHEREUM, reference: '1' }];
    },
  },
  utxo: {
    methods: DEFAULT_BITCOIN_METHODS,
    events: DEFAULT_BITCOIN_EVENTS,
    resolveChains: () => [
      { namespace: NAMESPACES.BITCOIN, reference: CAIP_BITCOIN_CHAIN_ID },
    ],
  },
};

/**
 * Builds a WalletConnect namespace proposal (chains, methods, events).
 *
 * Despite the name, the result can be placed in either `requiredNamespaces` or
 * `optionalNamespaces` depending on {@link shouldRequireNamespacesOnConnect}.
 *
 * @param targetChainReference - When set for EVM, limits the proposal to this
 *   single chain id (decimal string, e.g. `"137"`). Omit to include all EVM
 *   chains from `chains`.
 */
export function generateOptionalNamespace(
  chains: ChainIdParams[],
  namespaces: WalletConnectNamespace[],
  targetChainReference?: string
): FinalNamespaces | undefined {
  const proposal: FinalNamespaces = {};

  for (const namespace of namespaces) {
    const config = NAMESPACE_PROPOSALS[namespace];
    proposal[WC_NAMESPACE_TO_CAIP[namespace]] = {
      methods: config.methods,
      events: config.events,
      chains: config
        .resolveChains(chains, targetChainReference)
        .map((chain) => new ChainId(chain).toString()),
    };
  }

  return Object.keys(proposal).length > 0 ? proposal : undefined;
}

/**
 * WalletConnect treats required vs optional namespaces differently:
 * - Required: wallet must approve or the session is rejected.
 * - Optional: wallet may approve a subset (typical for multi-chain EVM dApps).
 */
export function shouldRequireNamespacesOnConnect(
  namespace: WalletConnectNamespace,
  chainReference?: string
): boolean {
  if (namespace === 'utxo') {
    return true;
  }

  // Target chain from connect/switchNetwork must be mandatory for the wallet.
  return namespace === 'evm' && !!chainReference;
}

export function buildConnectNamespacePayload(
  proposal: FinalNamespaces | undefined,
  namespace: WalletConnectNamespace,
  chainReference?: string
): ConnectNamespacePayload {
  const useRequired = shouldRequireNamespacesOnConnect(
    namespace,
    chainReference
  );

  if (useRequired) {
    return {
      requiredNamespaces: proposal ?? {},
      optionalNamespaces: {},
    };
  }

  return {
    requiredNamespaces: {},
    optionalNamespaces: proposal ?? {},
  };
}
