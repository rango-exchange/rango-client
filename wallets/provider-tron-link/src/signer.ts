import { DefaultTronSigner } from '@rango-dev/signer-tron';
import type { SignerFactory } from 'rango-types';
import Rango from 'rango-types';

// For cjs compatibility.
const { DefaultSignerFactory, TransactionType: TxType } = Rango;

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(provider));
  return signers;
}
