import { evmCoinbase, solanaCoinbase } from '../utils.js';

/*
 * Coinbase does not provide an eager connection mechanism for its Solana wallet.
 * The only workaround is to use the EVM-based eager connect approach.
 * However, this will only work if the EVM namespace has been connected at least once before.
 * If either wallet instance is unavailable, we throw an error.
 */
const canEagerConnectAction = async () => {
  const evmInstance = evmCoinbase();
  const solanaInstance = solanaCoinbase();
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
export const solanaActions = { canEagerConnectAction };
