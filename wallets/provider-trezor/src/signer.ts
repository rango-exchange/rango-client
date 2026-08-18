import type { SignerFactory } from 'rango-types';

import { dynamicImportWithRefinedError } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { EthereumSigner } = await dynamicImportWithRefinedError(
    async () => await import('./signers/ethereum.js')
  );
  const { BTCSigner } = await dynamicImportWithRefinedError(
    async () => await import('./signers/utxo.js')
  );
  signers.registerSigner(TxType.EVM, new EthereumSigner());
  signers.registerSigner(TxType.TRANSFER, new BTCSigner());
  return signers;
}
