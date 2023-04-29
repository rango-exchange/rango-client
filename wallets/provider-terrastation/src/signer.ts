import { DefaultCosmosSigner } from '@rango-dev/signer-cosmos';
import { SignerFactory, TransactionType as TxType } from 'rango-types';

// TODO: Change signer to Terra signer  

export default function getSigners(provider: any): SignerFactory {
  const signers = new SignerFactory();
  signers.registerSigner(TxType.COSMOS, new DefaultCosmosSigner(provider));
  return signers;
}
