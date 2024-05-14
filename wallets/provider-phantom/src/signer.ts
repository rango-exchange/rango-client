import type { SignerFactory } from 'rango-types';

import { DefaultSolanaSigner } from '@rango-dev/signer-solana';
import { getNetworkInstance, Networks } from '@rango-dev/wallets-shared';
import { TransactionType as TxType } from 'rango-types';

export default function getSigners(
  provider: any,
  defaultSigners: any
): SignerFactory {
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const signers = defaultSigners;
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  return signers;
}
