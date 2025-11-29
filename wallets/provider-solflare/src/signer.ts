import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { getNetworkInstance } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { SolflareSolanaSiger } from './signers/solana.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const solProvider = getNetworkInstance(provider, LegacyNetworks.SOLANA);

  signers.registerSigner(TxType.SOLANA, new SolflareSolanaSiger(solProvider));
  return signers;
}
