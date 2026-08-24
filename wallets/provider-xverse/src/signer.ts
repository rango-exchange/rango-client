import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { UTXO_NAMESPACE } from '@hub3js/namespaces';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { BTCSigner } from './signers/utxoSigner.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const bitcoinInstance = provider.get(UTXO_NAMESPACE);

  const signers = new DefaultSignerFactory();
  if (!!bitcoinInstance) {
    signers.registerSigner(TxType.TRANSFER, new BTCSigner(bitcoinInstance));
  }
  return signers;
}
