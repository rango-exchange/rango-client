import type { ActionContext } from '../../context';
import type { SwapExecution, SwapWallet } from '../../types';
import type { FindProxiedNamespace, Provider } from '@hub3js/core';
import type { DefaultNamespaces } from '@hub3js/namespaces';
import type { BlockchainMeta } from 'rango-types';

import { ActionBlockedError, ActionError } from '../../../errors';
import { findBlockchain } from '../meta';
import { getWalletProvider } from '../wallets';

/** What an action has in hand once the wallet for a chain is known to be usable. */
export type WalletEnvironment<K extends keyof DefaultNamespaces> = {
  wallet: SwapWallet;
  provider: Provider<DefaultNamespaces>;
  /** The provider's namespace for the chain, connected with the swap's account. */
  namespace: FindProxiedNamespace<K, DefaultNamespaces>;
  /** The chain's meta entry, when the host's meta has it. */
  blockchain: BlockchainMeta | undefined;
  /** The chain id from meta, to hand the signer. `null` when meta has none. */
  chainId: string | null;
};

/**
 * The guard every signing action runs first: the wallet the user picked for
 * the chain has to be connected on the namespace that signs there, with the
 * account the swap was started with. A wallet that is not throws
 * `ActionBlockedError`, so the step parks until the host reports a change.
 *
 * A wallet that cannot be looked up at all, or has no such namespace, is a
 * client error rather than a block, since waiting cannot fix it.
 */
export function ensureWalletConnected<K extends keyof DefaultNamespaces>(
  exec: SwapExecution,
  context: ActionContext,
  params: { blockChain: string; namespaceKey: K }
): WalletEnvironment<K> {
  const { blockChain, namespaceKey } = params;
  const { wallet, provider } = getWalletProvider(
    exec,
    blockChain,
    context.getProvider
  );

  const namespace = provider.get(namespaceKey);
  if (!namespace) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `Wallet ${wallet.walletType} has no ${namespaceKey} namespace`
    );
  }

  const [getState] = namespace.state();
  const state = getState();

  if (!state.connected) {
    throw new ActionBlockedError({
      reason: 'wallet_disconnected',
      walletType: wallet.walletType,
    });
  }
  if (!hasAccount(state.accounts, wallet.address)) {
    throw new ActionBlockedError({
      reason: 'wrong_account',
      walletType: wallet.walletType,
      requiredAddress: wallet.address,
    });
  }

  const blockchain = findBlockchain(context.getMeta(), blockChain);

  return {
    wallet,
    provider,
    namespace,
    blockchain,
    chainId: blockchain?.chainId ?? null,
  };
}

/**
 * Whether the namespace's accounts include the address. Hub keeps accounts in
 * CAIP-10 form (`eip155:1:0xabc`), so the address is the last segment.
 */
function hasAccount(accounts: string[] | null, address: string): boolean {
  return (accounts ?? []).some(
    (account) =>
      account.slice(account.lastIndexOf(':') + 1).toLowerCase() ===
      address.toLowerCase()
  );
}
