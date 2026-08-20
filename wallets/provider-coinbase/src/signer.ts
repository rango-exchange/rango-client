import type { Provider } from './utils.js';
import type { SignerFactory } from 'rango-types';

import { EVM_NAMESPACE, SOLANA_NAMESPACE } from '@hub3js/namespaces';
import { dynamicImportWithRefinedError } from '@rango-dev/common-core';
import { getNetworkInstance } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { CustomSolanaSigner } from './signers/solana-signer.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const ethProvider = getNetworkInstance(provider, EVM_NAMESPACE);
  const solProvider = getNetworkInstance(provider, SOLANA_NAMESPACE);
  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-evm')
  );
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new CustomSolanaSigner(solProvider));
  return signers;
}
