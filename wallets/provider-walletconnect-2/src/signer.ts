import type { WCInstance } from './types.js';
import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  instance: WCInstance
): Promise<SignerFactory> {
  if (!instance.session) {
    throw new Error('Session is required for wallet connect signers.');
  }

  const signers = new DefaultSignerFactory();
  const EVMSigner = (await import('./signers/evm.js')).default;
  const COSMOSSigner = (await import('./signers/cosmos.js')).default;
  const SOLANASigner = (await import('./signers/solana.js')).default;

  signers.registerSigner(
    TxType.EVM,
    new EVMSigner(instance.client, instance.session)
  );
  signers.registerSigner(
    TxType.COSMOS,
    new COSMOSSigner(instance.client, instance.session)
  );
  signers.registerSigner(
    TxType.SOLANA,
    new SOLANASigner(instance.client, instance.session)
  );

  return signers;
}
