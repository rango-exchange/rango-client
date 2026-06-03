import type { ProviderAPI } from '@hub3js/evm';
import type { SignerFactory } from 'rango-types';

import { dynamicImportWithRefinedError } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: ProviderAPI
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-evm')
  );
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(provider));
  return signers;
}
