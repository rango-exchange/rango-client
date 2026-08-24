import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { TON_NAMESPACE } from '@hub3js/namespaces';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const tonProvider = provider.get(TON_NAMESPACE);
  const signers = new DefaultSignerFactory();
  const { CustomTonSigner } = await import('./signers/ton.js');
  if (!!tonProvider) {
    signers.registerSigner(TxType.TON, new CustomTonSigner(tonProvider));
  }
  return signers;
}
