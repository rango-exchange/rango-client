import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { LegacyNetworks as Networks } from '@rango-dev/wallets-core/legacy';
import { getNetworkInstance } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { BTCSigner } from './signers/utxoSigner.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const bitcoinInstance = getNetworkInstance(provider, Networks.BTC);

  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.TRANSFER, new BTCSigner(bitcoinInstance));
  return signers;
}
