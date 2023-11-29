import type { SignerFactory } from 'rango-types';

import { DefaultCosmosSnapSigner } from '@rango-dev/signer-cosmos-snap';
import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(provider));
  signers.registerSigner(TxType.COSMOS, new DefaultCosmosSnapSigner(provider));

  return signers;
}
