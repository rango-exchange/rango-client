import type { Provider } from './types.js';

import { Networks } from '@rango-dev/wallets-shared';

import { TonConnectAdapter } from './tonConnectAdapter.js';

export const tonConnect = new TonConnectAdapter();

export function getInstanceOrThrow(): Provider {
  const instance = tonConnect.getInstance();

  const instances = new Map([[Networks.TON, instance]]);
  return instances as Provider;
}
