import type { Provider } from './utils.js';
import type { SignerFactory } from 'rango-types';

import { SOLANA_NAMESPACE, UTXO_NAMESPACE } from '@hub3js/namespaces';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const solProvider = provider.get(SOLANA_NAMESPACE);
  const bitcoinInstance = provider.get(UTXO_NAMESPACE);

  const { DefaultSolanaSigner } = await import('@rango-dev/signer-solana');
  const { BTCSigner } = await import('./signers/utxoSigner.js');
  const signers = new DefaultSignerFactory();
  if (!!solProvider) {
    signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  }
  if (!!bitcoinInstance) {
    signers.registerSigner(TxType.TRANSFER, new BTCSigner(bitcoinInstance));
  }

  return signers;
}
