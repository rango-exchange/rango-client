import {
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from 'rango-types';

import { WCInstance } from './types';
import EVMSigner from './signers/evm';
import COSMOSSigner from './signers/cosmos';
import SOLANASigner from './signers/solana';

export default function getSigners(instance: WCInstance): SignerFactory {
  if (!instance.session) {
    throw new Error('Session is required for wallet connect signers.');
  }

  const signers = new DefaultSignerFactory();
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
