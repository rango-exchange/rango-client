import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { UTXO_NAMESPACE } from '@hub3js/namespaces';
import { getNetworkInstance } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { BTCSigner } from './signers/utxoSigner.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const bitcoinInstance = getNetworkInstance(provider, UTXO_NAMESPACE);

  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.TRANSFER, new BTCSigner(bitcoinInstance));
  return signers;
}
