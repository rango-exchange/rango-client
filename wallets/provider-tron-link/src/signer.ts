import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { TRON_NAMESPACE } from '@hub3js/namespaces';
import { getNetworkInstance } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const tronProvider = getNetworkInstance(provider, TRON_NAMESPACE);
  const signers = new DefaultSignerFactory();
  const { DefaultTronSigner } = await import('@rango-dev/signer-tron');
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(tronProvider));
  return signers;
}
