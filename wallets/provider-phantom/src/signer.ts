import type { SignerFactory } from 'rango-types';

import { DefaultSolanaSigner } from '@rango-dev/signer-solana';
import { getNetworkInstance, Networks } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(
  provider: any,
  signerConfig: any
): SignerFactory {
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(
    TxType.SOLANA,
    new DefaultSolanaSigner(solProvider, signerConfig?.customSolanaRPC)
  );
  return signers;
}
