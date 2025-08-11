import type { SignerFactory } from 'rango-types';

import { retryLazyImport } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { EthereumSigner } = await retryLazyImport(
    async () => await import('./signers/ethereum.js')
  );
  signers.registerSigner(TxType.EVM, new EthereumSigner());
  return signers;
}
