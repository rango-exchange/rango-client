import type { WalletConnectNamespace } from '../types.js';
import type { ISignClient, SessionTypes } from '@walletconnect/types';

import { WC_NAMESPACE_TO_CAIP } from '../wcConstants.js';

export function getCaipNamespace(namespace: WalletConnectNamespace): string {
  return WC_NAMESPACE_TO_CAIP[namespace];
}

export function findSessionByNamespace(
  client: ISignClient,
  namespace: WalletConnectNamespace
): SessionTypes.Struct | undefined {
  const caipNamespace = getCaipNamespace(namespace);

  return client.session.getAll().find((session) => {
    const ns = session.namespaces[caipNamespace];
    if ((ns?.accounts?.length ?? 0) > 0) {
      return true;
    }

    return namespace === 'utxo' && (ns?.chains?.length ?? 0) > 0;
  });
}

export function getSessionNamespace(
  session: SessionTypes.Struct
): WalletConnectNamespace | undefined {
  const hasAccounts = (namespace: WalletConnectNamespace) =>
    (session.namespaces[WC_NAMESPACE_TO_CAIP[namespace]]?.accounts?.length ??
      0) > 0;
  const hasChains = (namespace: WalletConnectNamespace) =>
    (session.namespaces[WC_NAMESPACE_TO_CAIP[namespace]]?.chains?.length ?? 0) >
    0;

  /*
   * Prefer a namespace the wallet shared accounts for; fall back to one that
   * only negotiated chains (utxo can be chains-only before its account settles).
   */
  if (hasAccounts('evm')) {
    return 'evm';
  }
  if (hasAccounts('utxo')) {
    return 'utxo';
  }
  if (hasChains('utxo')) {
    return 'utxo';
  }
  if (hasChains('evm')) {
    return 'evm';
  }

  return undefined;
}
