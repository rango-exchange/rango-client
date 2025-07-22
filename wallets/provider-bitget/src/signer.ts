import type { SignerFactory } from 'rango-types';

import { DefaultTronSigner } from '@arlert-dev/signer-tron';
import { getNetworkInstance, Networks } from '@arlert-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const tronProvider = getNetworkInstance(provider, Networks.TRON);
  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await import('@arlert-dev/signer-evm');
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(tronProvider));
  return signers;
}
