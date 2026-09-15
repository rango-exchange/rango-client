import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { getAdapter } from './adapter/registry.js';

export default async function getSigners(): Promise<SignerFactory> {
  const adapter = getAdapter();
  if (!adapter) {
    throw new Error('WalletConnect provider has not been initialized.');
  }

  const client = await adapter.getClient();

  const signers = new DefaultSignerFactory();
  const EVMSigner = (await import('./signers/evm.js')).default;
  signers.registerSigner(
    TxType.EVM,
    new EVMSigner(client, () => adapter.getSession('evm'))
  );

  return signers;
}
