import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { SOLANA_NAMESPACE } from '@hub3js/namespaces';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const solProvider = provider.get(SOLANA_NAMESPACE);

  const signers = new DefaultSignerFactory();
  const { DefaultSolanaSigner } = await import('@rango-dev/signer-solana');

  if (!!solProvider) {
    signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  }

  return signers;
}
