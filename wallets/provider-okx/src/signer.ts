import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import {
  EVM_NAMESPACE,
  SOLANA_NAMESPACE,
  TON_NAMESPACE,
  TRON_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';
import { dynamicImportWithRefinedError } from '@rango-dev/common-core';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { OKXSolanaSigner } from './signers/solana.js';
import { OKXTonSigner } from './signers/ton.js';
import { OKXUTXOSigner } from './signers/utxo.js';
import { suiWalletInstance } from './utils.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const ethProvider = provider.get(EVM_NAMESPACE);
  const solProvider = provider.get(SOLANA_NAMESPACE);
  const utxoProvider = provider.get(UTXO_NAMESPACE);
  const tonProvider = provider.get(TON_NAMESPACE);
  const tronProvider = provider.get(TRON_NAMESPACE);

  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-evm')
  );
  const { DefaultTronSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-tron')
  );
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new OKXSolanaSigner(solProvider));
  signers.registerSigner(TxType.TRANSFER, new OKXUTXOSigner(utxoProvider));
  signers.registerSigner(TxType.TON, new OKXTonSigner(tonProvider));
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(tronProvider));

  const suiProvider = suiWalletInstance();
  if (suiProvider) {
    const { DefaultSuiSigner } = await dynamicImportWithRefinedError(
      async () => await import('@rango-dev/signer-sui')
    );
    signers.registerSigner(TxType.SUI, new DefaultSuiSigner(suiProvider));
  }

  return signers;
}
