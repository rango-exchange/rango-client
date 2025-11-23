import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import {
  dynamicImportWithRefinedError,
  getNetworkInstance,
  Networks,
} from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType } from 'rango-types';

import { CloverSolanaSigner } from './singers/solana.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-evm')
  );
  signers.registerSigner(
    TransactionType.EVM,
    new DefaultEvmSigner(ethProvider)
  );
  signers.registerSigner(
    TransactionType.SOLANA,
    new CloverSolanaSigner(solProvider)
  );
  return signers;
}
