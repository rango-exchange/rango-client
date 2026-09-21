import type { SwapExecution, SwapWallet } from '../types';
import type { Provider } from '@hub3js/core';
import type { DefaultNamespaces } from '@hub3js/namespaces';

import { ActionError } from '../../errors';

/**
 * The wallet the user picked for a chain, and the hub provider behind it.
 * Both have to be there for an action to sign or read anything, so a missing
 * one is reported as a client error rather than left for the caller to check.
 */
export function getWalletProvider(
  exec: SwapExecution,
  blockChain: string,
  getProvider: (type: string) => Provider<DefaultNamespaces> | undefined
): { wallet: SwapWallet; provider: Provider<DefaultNamespaces> } {
  const wallet = exec.wallets[blockChain];
  if (!wallet) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `The swap has no wallet for ${blockChain}`
    );
  }

  const provider = getProvider(wallet.walletType);
  if (!provider) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `Wallet ${wallet.walletType} is not available`
    );
  }

  return { wallet, provider };
}
