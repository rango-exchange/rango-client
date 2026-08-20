import type { SignerFactory } from 'rango-types';

import { dynamicImportWithRefinedError } from '@rango-dev/common-core';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { getAdapter } from './adapter/registry.js';

export default async function getSigners(): Promise<SignerFactory> {
  const adapter = getAdapter();
  if (!adapter) {
    throw new Error('WalletConnect provider has not been initialized.');
  }

  const client = await adapter.getClient();

  const signers = new DefaultSignerFactory();
  const EVMSigner = (
    await dynamicImportWithRefinedError(
      async () => await import('./signers/evm.js')
    )
  ).default;
  const UtxoSigner = (
    await dynamicImportWithRefinedError(
      async () => await import('./signers/utxo.js')
    )
  ).default;
  signers.registerSigner(
    TxType.EVM,
    new EVMSigner(client, () => adapter.getSession('evm'))
  );
  signers.registerSigner(
    TxType.TRANSFER,
    new UtxoSigner(client, () => adapter.getSession('utxo'))
  );

  return signers;
}
