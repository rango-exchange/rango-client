import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import {
  EVM_NAMESPACE,
  TRON_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';
import { dynamicImportWithRefinedError } from '@rango-dev/common-core';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { BitgetUTXOSigner } from './signers/utxo.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const ethProvider = provider.get(EVM_NAMESPACE);
  const tronProvider = provider.get(TRON_NAMESPACE);
  const utxoProvider = provider.get(UTXO_NAMESPACE);

  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-evm')
  );
  const { DefaultTronSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-tron')
  );
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(tronProvider));
  signers.registerSigner(TxType.TRANSFER, new BitgetUTXOSigner(utxoProvider));

  return signers;
}
