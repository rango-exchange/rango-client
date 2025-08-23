import type { SuiActions } from './types.js';
import type { CanEagerConnect } from '../../hub/namespaces/types.js';

import { getInstanceOrThrow } from './mod.js';

interface CanEagerConnectParams {
  name: string;
}
export function canEagerConnect(
  params: CanEagerConnectParams
): CanEagerConnect<SuiActions> {
  return async () => {
    const wallet = getInstanceOrThrow(params.name);

    try {
      const connectResult = await wallet.features['standard:connect'].connect({
        silent: true,
      });
      if (connectResult.accounts.length) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };
}
