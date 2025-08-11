import type { ProviderAPI } from '@rango-dev/wallets-core/namespaces/evm';
import type { SignerFactory } from 'rango-types';

import { retryLazyImport } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: ProviderAPI
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await retryLazyImport(
    async () => await import('@rango-dev/signer-evm')
  );
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(provider));
  return signers;
}
