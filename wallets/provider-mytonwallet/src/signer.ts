import type { TonProvider } from './types';
import type { DefaultSignerFactory, SignerFactory } from 'rango-types';

import { DefaultTonSigner } from '@rango-dev/signer-ton';
import { TransactionType as TxType } from 'rango-types';

export default function getSigners(
  provider: TonProvider,
  defaultSigners: DefaultSignerFactory
): SignerFactory {
  const signers = defaultSigners;
  signers.registerSigner(TxType.TON, new DefaultTonSigner(provider));
  return signers;
}
