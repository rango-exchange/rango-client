import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { TRON_NAMESPACE } from '@hub3js/namespaces';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const tronProvider = provider.get(TRON_NAMESPACE);
  const signers = new DefaultSignerFactory();
  const { DefaultTronSigner } = await import('@rango-dev/signer-tron');
  if (!!tronProvider) {
    signers.registerSigner(TxType.TRON, new DefaultTronSigner(tronProvider));
  }
  return signers;
}
