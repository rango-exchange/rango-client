import type { Provider, VultisigZcashProviderApi } from './types.js';

import { UTXO_NAMESPACE } from '@hub3js/namespaces';

export function vultisig(): Provider | null {
  const { vultisig } = window;
  if (!vultisig) {
    return null;
  }

  const instances: Provider = new Map();

  if (vultisig.zcash) {
    instances.set(UTXO_NAMESPACE, vultisig.zcash);
  }

  return instances;
}

export function vultisigZcash(): VultisigZcashProviderApi {
  const instances = vultisig();
  const zcashInstance = instances?.get(UTXO_NAMESPACE);

  if (!zcashInstance) {
    throw new Error('Vultisig not injected. Please check your wallet.');
  }

  return zcashInstance;
}
