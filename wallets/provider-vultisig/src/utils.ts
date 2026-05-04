import type { Provider, VultisigZcashProviderApi } from './types.js';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function vultisig(): Provider | null {
  const { vultisig } = window;
  if (!vultisig) {
    return null;
  }

  const instances: Provider = new Map();

  if (vultisig.zcash) {
    instances.set(LegacyNetworks.ZCASH, vultisig.zcash);
  }

  return instances;
}

export function vultisigZcash(): VultisigZcashProviderApi {
  const instances = vultisig();
  const zcashInstance = instances?.get(LegacyNetworks.ZCASH);

  if (!zcashInstance) {
    throw new Error('Vultisig not injected. Please check your wallet.');
  }

  return zcashInstance;
}
