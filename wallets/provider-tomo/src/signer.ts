import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { EVM_NAMESPACE } from '@hub3js/namespaces';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const ethProvider = provider.get(EVM_NAMESPACE);
  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await import('@rango-dev/signer-evm');
  if (!!ethProvider) {
    signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  }
  return signers;
}
