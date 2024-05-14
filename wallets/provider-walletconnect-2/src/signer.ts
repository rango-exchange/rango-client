import type { WCInstance } from './types';
import type { DefaultSignerFactory, SignerFactory } from 'rango-types';

import { TransactionType as TxType } from 'rango-types';

import COSMOSSigner from './signers/cosmos';
import EVMSigner from './signers/evm';
import SOLANASigner from './signers/solana';

export default function getSigners(
  instance: WCInstance,
  defaultSigners: DefaultSignerFactory
): SignerFactory {
  if (!instance.session) {
    throw new Error('Session is required for wallet connect signers.');
  }

  const signers = defaultSigners;
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
