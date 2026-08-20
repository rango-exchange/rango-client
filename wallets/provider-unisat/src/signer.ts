import type { Provider } from './utils.js';
import type { SignerFactory } from 'rango-types';

import { UTXO_NAMESPACE } from '@hub3js/namespaces';
import { dynamicImportWithRefinedError } from '@rango-dev/common-core';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const bitcoinInstance = provider.get(UTXO_NAMESPACE);
  const { BTCSigner } = await dynamicImportWithRefinedError(
    async () => await import('./signers/utxoSigner.js')
  );
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.TRANSFER, new BTCSigner(bitcoinInstance));
  return signers;
}
