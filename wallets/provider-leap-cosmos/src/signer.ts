import type { DefaultSignerFactory, SignerFactory } from 'rango-types';

import { DefaultCosmosSigner } from '@rango-dev/signer-cosmos';
import { getNetworkInstance, Networks } from '@rango-dev/wallets-shared';
import { TransactionType as TxType } from 'rango-types';

export default function getSigners(
  provider: any,
  defaultSigners: DefaultSignerFactory
): SignerFactory {
  const cosmosProvider = getNetworkInstance(provider, Networks.COSMOS);
  const signers = defaultSigners;
  signers.registerSigner(
    TxType.COSMOS,
    new DefaultCosmosSigner(cosmosProvider)
  );
  return signers;
}
