import { DefaultStarknetSigner } from '@rango-dev/signer-starknet';
import type { SignerFactory } from 'rango-types';

import Rango from 'rango-types';

// For cjs compatibility.
const { DefaultSignerFactory, TransactionType: TxType } = Rango;

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.STARKNET, new DefaultStarknetSigner(provider));
  return signers;
}
