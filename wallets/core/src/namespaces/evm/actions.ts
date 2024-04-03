import type { NamespaceProvider } from './types';
import type { Context } from '../../hub/namespace';

import { recommended as commonRecommended } from '../common/actions';

import { getAccounts } from './utils';

export const recommended = [...commonRecommended];

// TODO: Make returned function type safe.
export function connect(instance: () => NamespaceProvider) {
  return [
    'connect',
    async (_context: Context, _chain: any) => {
      // TODO: use chain if it's provided.
      const evmInstance = instance();

      if (!evmInstance) {
        throw new Error(
          'Are your wallet injected correctly and is evm compatible?'
        );
      }

      const result = await getAccounts(evmInstance);

      console.log('you are a trader? using evm?', result);
      return result.accounts;
    },
  ] as const;
}
