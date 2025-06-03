import type { Context } from '../../../hub/namespaces/mod.js';
import type { FunctionWithContext } from '../../../types/actions.js';
import type { ProviderAPI, SolanaActions } from '../types.js';

import base58 from 'bs58';

export function signMessage(
  instance: () => ProviderAPI | undefined
): FunctionWithContext<SolanaActions['signMessage'], Context> {
  return async (_context, msg: string) => {
    const solanaInstance = instance();
    if (!solanaInstance) {
      throw new Error(
        'Do your wallet injected correctly and is evm compatible?'
      );
    }
    const encodedMessage = new TextEncoder().encode(msg);
    const { signature } = await solanaInstance.request({
      method: 'signMessage',
      params: {
        message: encodedMessage,
      },
    });
    return base58.encode(signature);
  };
}
