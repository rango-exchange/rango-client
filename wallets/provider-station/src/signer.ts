import { DefaultTerraSigner } from '@rango-dev/signer-terra';
import type { SignerFactory } from 'rango-types';
import Rango from 'rango-types';

// For cjs compatibility.
const { DefaultSignerFactory, TransactionType: TxType } = Rango;

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.COSMOS, new DefaultTerraSigner(provider));
  return signers;
}
