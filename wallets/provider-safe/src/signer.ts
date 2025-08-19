import type { ProviderAPI } from '@rango-dev/wallets-core/namespaces/evm';
import type { SignerFactory } from 'rango-types';

import { dynamicImportWithRefinedError } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: ProviderAPI
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { CustomEvmSigner } = await dynamicImportWithRefinedError(
    async () => await import('./signers/evm.js')
  );
  signers.registerSigner(TxType.EVM, new CustomEvmSigner(provider));

  return signers;
}
