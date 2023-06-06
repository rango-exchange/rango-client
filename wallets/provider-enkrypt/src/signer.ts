import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import type { SignerFactory } from 'rango-types';

import Rango from 'rango-types';

// For cjs compatibility.
const { DefaultSignerFactory, TransactionType: TxType } = Rango;

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(provider));
  return signers;
}
