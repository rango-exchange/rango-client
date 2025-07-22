import type { SignerFactory } from 'rango-types';

import { getNetworkInstance, Networks } from '@arlert-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await import('@arlert-dev/signer-evm');
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  return signers;
}
