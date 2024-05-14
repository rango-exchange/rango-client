import type { DefaultSignerFactory, SignerFactory } from 'rango-types';

import { DefaultStarknetSigner } from '@rango-dev/signer-starknet';
import { TransactionType as TxType } from 'rango-types';

export default function getSigners(
  provider: any,
  defaultSigners: DefaultSignerFactory
): SignerFactory {
  const signers = defaultSigners;
  signers.registerSigner(TxType.STARKNET, new DefaultStarknetSigner(provider));
  return signers;
}
