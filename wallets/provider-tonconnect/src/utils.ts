import type { Provider } from './types.js';

import { TON_NAMESPACE } from '@hub3js/namespaces';

import { TonConnectAdapter } from './tonConnectAdapter.js';

export const tonConnect = new TonConnectAdapter();

export function getInstanceOrThrow(): Provider {
  const instance = tonConnect.getInstance();

  const instances = new Map([[TON_NAMESPACE, instance]]);
  return instances as Provider;
}
