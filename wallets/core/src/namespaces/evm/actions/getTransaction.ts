import type { Context } from '../../../hub/namespaces/mod.js';
import type { FunctionWithContext } from '../../../types/actions.js';
import type { EvmActions, ProviderAPI } from '../types.js';

import { BrowserProvider } from 'ethers';

export function getTransaction(
  instance: () => ProviderAPI | undefined
): FunctionWithContext<EvmActions['getTransaction'], Context> {
  return async (_context, hash: string) => {
    const evmInstance = instance();
    if (!evmInstance) {
      throw new Error(
        'Do your wallet injected correctly and is evm compatible?'
      );
    }
    const provider = new BrowserProvider(evmInstance);

    return await provider.getTransaction(hash);
  };
}
