import type { SignerFactory } from 'rango-types';

import { getNetworkInstance, Networks } from '@arlert-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const cosmosProvider = getNetworkInstance(provider, Networks.COSMOS);
  const signers = new DefaultSignerFactory();
  const { DefaultCosmosSigner } = await import('@arlert-dev/signer-cosmos');
  signers.registerSigner(
    TxType.COSMOS,
    new DefaultCosmosSigner(cosmosProvider)
  );
  return signers;
}
