import type { Provider } from '../utils.js';
import type { SignerFactory } from 'rango-types';

import { LegacyNetworks as Networks } from '@arlert-dev/wallets-core/legacy';
import { getNetworkInstance } from '@arlert-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const evmProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await import('@arlert-dev/signer-evm');
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(evmProvider));
  return signers;
}
