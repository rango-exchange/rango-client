import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import {
  EVM_NAMESPACE,
  SOLANA_NAMESPACE,
  TON_NAMESPACE,
  TRON_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';
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
  const { DefaultEvmSigner } = await import('@rango-dev/signer-evm');
  const { DefaultTronSigner } = await import('@rango-dev/signer-tron');
  if (!!ethProvider) {
    signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  }
  if (!!solProvider) {
    signers.registerSigner(TxType.SOLANA, new OKXSolanaSigner(solProvider));
  }
  if (!!utxoProvider) {
    signers.registerSigner(TxType.TRANSFER, new OKXUTXOSigner(utxoProvider));
  }
  if (!!tonProvider) {
    signers.registerSigner(TxType.TON, new OKXTonSigner(tonProvider));
  }
  if (!!tronProvider) {
    signers.registerSigner(TxType.TRON, new DefaultTronSigner(tronProvider));
  }

  const suiProvider = suiWalletInstance();
  if (suiProvider) {
    const { DefaultSuiSigner } = await import('@rango-dev/signer-sui');
    signers.registerSigner(TxType.SUI, new DefaultSuiSigner(suiProvider));
  }

  return signers;
}
