import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import {
  EVM_NAMESPACE,
  SOLANA_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';
import {
  dynamicImportWithRefinedError,
  getNetworkInstance,
} from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { OKXSolanaSigner } from './signers/solana.js';
import { OKXUTXOSigner } from './signers/utxo.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const ethProvider = getNetworkInstance(provider, EVM_NAMESPACE);
  const solProvider = getNetworkInstance(provider, SOLANA_NAMESPACE);
  const utxoProvider = getNetworkInstance(provider, UTXO_NAMESPACE);

  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-evm')
  );
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new OKXSolanaSigner(solProvider));
  signers.registerSigner(TxType.TRANSFER, new OKXUTXOSigner(utxoProvider));

  return signers;
}
