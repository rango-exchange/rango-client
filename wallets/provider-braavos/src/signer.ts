import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { STARKNET_NAMESPACE } from '@hub3js/namespaces';
import { dynamicImportWithRefinedError } from '@rango-dev/common-core';
import { DefaultSignerFactory, TransactionType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();

  const starknetProvider = provider.get(STARKNET_NAMESPACE);

  const { DefaultStarknetSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-starknet')
  );
  signers.registerSigner(
    TransactionType.STARKNET,
    new DefaultStarknetSigner(starknetProvider)
  );
  return signers;
}
