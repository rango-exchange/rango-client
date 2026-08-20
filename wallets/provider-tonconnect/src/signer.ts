import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { TON_NAMESPACE } from '@hub3js/namespaces';
import { dynamicImportWithRefinedError } from '@rango-dev/common-core';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const tonProvider = provider.get(TON_NAMESPACE);
  const signers = new DefaultSignerFactory();
  const { CustomTonSigner } = await dynamicImportWithRefinedError(
    async () => await import('./signers/ton.js')
  );
  signers.registerSigner(TxType.TON, new CustomTonSigner(tonProvider));
  return signers;
}
