import type { Provider } from './utils.js';
import type { SignerFactory } from 'rango-types';

import { EVM_NAMESPACE } from '@hub3js/namespaces';
import { dynamicImportWithRefinedError } from '@rango-dev/common-core';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const evmProvider = provider.get(EVM_NAMESPACE);
  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-evm')
  );
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(evmProvider));
  return signers;
}
