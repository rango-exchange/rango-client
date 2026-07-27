import type { Provider } from './utils.js';
import type { SignerFactory } from 'rango-types';

import {
  EVM_NAMESPACE,
  SOLANA_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';
import { getInstance as getSuiInstance } from '@hub3js/sui';
import {
  dynamicImportWithRefinedError,
  getNetworkInstance,
} from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { WALLET_NAME_IN_WALLET_STANDARD } from './constants.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const solProvider = getNetworkInstance(provider, SOLANA_NAMESPACE);
  const evmProvider = getNetworkInstance(provider, EVM_NAMESPACE);
  const bitcoinInstance = getNetworkInstance(provider, UTXO_NAMESPACE);

  const suiProvider = getSuiInstance(WALLET_NAME_IN_WALLET_STANDARD);

  const { DefaultEvmSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-evm')
  );
  const { DefaultSolanaSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-solana')
  );
  const { BTCSigner } = await dynamicImportWithRefinedError(
    async () => await import('./signers/utxoSigner.js')
  );
  const { DefaultSuiSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-sui')
  );
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(evmProvider));
  signers.registerSigner(TxType.TRANSFER, new BTCSigner(bitcoinInstance));
  if (!!suiProvider) {
    signers.registerSigner(TxType.SUI, new DefaultSuiSigner(suiProvider));
  }
  return signers;
}
