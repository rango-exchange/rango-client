import type { Network } from '@rango-dev/wallets-shared';

import { Networks } from '@rango-dev/wallets-shared';

type Provider = Map<Network, any>;

export function bitgetInstances(): Provider | null {
  const instances: Provider = new Map();
  const { bitkeep } = window;

  if (!bitkeep) {
    return null;
  }

  if (bitkeep.ethereum) {
    instances.set(Networks.ETHEREUM, bitkeep.ethereum);
  }

  if (bitkeep.tronLink) {
    instances.set(Networks.TRON, bitkeep.tronLink);
  }

  if (instances.size === 0) {
    return null;
  }

  return instances;
}
