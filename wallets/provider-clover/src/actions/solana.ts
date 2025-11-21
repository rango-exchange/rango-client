import type { Context, FunctionWithContext } from '@rango-dev/wallets-core';

import {
  type ProviderAPI,
  type SolanaActions,
  utils,
} from '@rango-dev/wallets-core/namespaces/solana';

import { evmClover, solanaClover } from '../utils.js';
// Clover doesn't have a connect action like other solana wallets and getAccount is being used for connection
export function connect(
  instance: () => ProviderAPI
): FunctionWithContext<SolanaActions['connect'], Context> {
  return async () => {
    const solanaInstance = instance();
    if (!solanaInstance) {
      throw new Error('Solana instance is not available');
    }
    const solanaAccounts = await solanaInstance.getAccount();

    return utils.formatAccountsToCAIP([solanaAccounts]);
  };
}
/*
 * Clover does not provide an eager connection mechanism for its Solana wallet.
 * The only workaround is to use the EVM-based eager connect approach.
 * However, this will only work if the EVM namespace has been connected at least once before.
 * If either wallet instance is unavailable, we throw an error.
 */
const canEagerConnectAction = async () => {
  const evmInstance = evmClover();
  const solanaInstance = solanaClover();
  // Making sure that the Solana instance is available first to prevent errors.
  if (!solanaInstance) {
    throw new Error(
      'Trying to eagerly connect to your wallet, but seems its solana instance is not available.'
    );
  }
  if (!evmInstance) {
    throw new Error(
      'Trying to eagerly connect to your EVM wallet, but seems its instance is not available.'
    );
  }

  try {
    const accounts: string[] = await evmInstance.request({
      method: 'eth_accounts',
    });
    if (accounts.length) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
export const solanaActions = { connect, canEagerConnectAction };
