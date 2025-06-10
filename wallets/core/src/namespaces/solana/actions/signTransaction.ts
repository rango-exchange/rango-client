import type { Context } from '../../../hub/namespaces/mod.js';
import type { FunctionWithContext } from '../../../types/actions.js';
import type { ProviderAPI, SolanaActions } from '../types.js';

export function signTransaction(
  instance: () => ProviderAPI | undefined
): FunctionWithContext<SolanaActions['signTransaction'], Context> {
  return async (_context, transaction) => {
    const solanaInstance = instance();
    if (!solanaInstance) {
      throw new Error(
        'Do your wallet injected correctly and is evm compatible?'
      );
    }
    const solanaProvider = instance();

    if (!solanaProvider) {
      throw new Error('Solana provider is not available.');
    }
    return await solanaProvider.signTransaction(transaction);
  };
}
