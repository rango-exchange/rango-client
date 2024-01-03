import { DefaultTerraSigner } from '@yeager-dev/signer-terra';
import { DefaultSignerFactory } from 'rango-types';
import { SignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.COSMOS, new DefaultTerraSigner(provider));
  return signers;
}
