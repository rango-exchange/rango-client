import type { Context } from '../../../hub/namespaces/mod.js';
import type { FunctionWithContext } from '../../../types/actions.js';
import type { EvmActions, ProviderAPI } from '../types.js';

import { BrowserProvider } from 'ethers';

export function signMessage(
  instance: () => ProviderAPI | undefined
): FunctionWithContext<EvmActions['signMessage'], Context> {
  return async (_context, msg: string) => {
    const evmInstance = instance();
    if (!evmInstance) {
      throw new Error(
        'Do your wallet injected correctly and is evm compatible?'
      );
    }
    const provider = new BrowserProvider(evmInstance);
    const signer = await provider.getSigner();
    return await signer.signMessage(msg);
  };
}
