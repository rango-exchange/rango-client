import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { SOLANA_NAMESPACE } from '@hub3js/namespaces';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { SolflareSolanaSiger } from './signers/solana.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const solProvider = provider.get(SOLANA_NAMESPACE);

  signers.registerSigner(TxType.SOLANA, new SolflareSolanaSiger(solProvider));
  return signers;
}
