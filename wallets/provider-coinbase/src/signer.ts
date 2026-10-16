import type { Provider } from './utils.js';
import type { SignerFactory } from 'rango-types';

import { SOLANA_NAMESPACE } from '@hub3js/namespaces';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { CustomSolanaSigner } from './signers/solana-signer.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const solProvider = provider.get(SOLANA_NAMESPACE);
  const signers = new DefaultSignerFactory();
  if (!!solProvider) {
    signers.registerSigner(TxType.SOLANA, new CustomSolanaSigner(solProvider));
  }
  return signers;
}
