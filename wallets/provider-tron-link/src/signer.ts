import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { TRON_NAMESPACE } from '@hub3js/namespaces';
import { dynamicImportWithRefinedError } from '@rango-dev/common-core';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const tronProvider = provider.get(TRON_NAMESPACE);
  const signers = new DefaultSignerFactory();
  const { DefaultTronSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-tron')
  );
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(tronProvider));
  return signers;
}
