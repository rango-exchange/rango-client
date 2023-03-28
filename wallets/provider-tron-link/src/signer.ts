import { DefaultTronSigner } from '@rango-dev/signer-tron';
import { SignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const signers = new SignerFactory();
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(provider));
  return signers;
}
