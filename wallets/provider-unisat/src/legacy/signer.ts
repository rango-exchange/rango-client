import type { Provider } from '../utils.js';
import type { SignerFactory } from 'rango-types';

import { LegacyNetworks as Networks } from '@arlert-dev/wallets-core/legacy';
import { getNetworkInstance } from '@arlert-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const bitcoinInstance = getNetworkInstance(provider, Networks.BTC);
  const { BTCSigner } = await import('./utxoSigner.js');
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.TRANSFER, new BTCSigner(bitcoinInstance));
  return signers;
}
