import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import {
  dynamicImportWithRefinedError,
  getNetworkInstance,
  Networks,
} from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { OKXSolanaSigner } from './signers/solana.js';
import { OKXUTXOSigner } from './signers/utxo.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const utxoProvider = getNetworkInstance(provider, Networks.BTC);

  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-evm')
  );
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new OKXSolanaSigner(solProvider));
  signers.registerSigner(TxType.TRANSFER, new OKXUTXOSigner(utxoProvider));

  return signers;
}
