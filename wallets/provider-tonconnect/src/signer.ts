import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import {
  dynamicImportWithRefinedError,
  getNetworkInstance,
  Networks,
} from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const tonProvider = getNetworkInstance(provider, Networks.TON);
  const signers = new DefaultSignerFactory();
  const { CustomTonSigner } = await dynamicImportWithRefinedError(
    async () => await import('./signers/ton.js')
  );
  signers.registerSigner(TxType.TON, new CustomTonSigner(tonProvider));
  return signers;
}
