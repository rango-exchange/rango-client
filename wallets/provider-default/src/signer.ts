import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { EVM_NAMESPACE } from '@hub3js/namespaces';
import { getNetworkInstance } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const evmProvider = getNetworkInstance(provider, EVM_NAMESPACE);
  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await import('@rango-dev/signer-evm');
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(evmProvider));
  return signers;
}
