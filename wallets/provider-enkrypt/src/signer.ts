import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { EVM_NAMESPACE } from '@hub3js/namespaces';
import { dynamicImportWithRefinedError } from '@rango-dev/common-core';
import { getNetworkInstance } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const ethProvider = getNetworkInstance(provider, EVM_NAMESPACE);
  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-evm')
  );
  signers.registerSigner(
    TransactionType.EVM,
    new DefaultEvmSigner(ethProvider)
  );
  return signers;
}
