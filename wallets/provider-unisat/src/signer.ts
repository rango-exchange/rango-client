import type { Provider } from './utils.js';
import type { SignerFactory } from 'rango-types';

import { UTXO_NAMESPACE } from '@hub3js/namespaces';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const bitcoinInstance = provider.get(UTXO_NAMESPACE);
  const { BTCSigner } = await import('./signers/utxoSigner.js');
  const signers = new DefaultSignerFactory();
  if (!!bitcoinInstance) {
    signers.registerSigner(TxType.TRANSFER, new BTCSigner(bitcoinInstance));
  }
  return signers;
}
