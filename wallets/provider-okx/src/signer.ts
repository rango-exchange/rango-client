import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import {
  TON_NAMESPACE,
  TRON_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { OKXTonSigner } from './signers/ton.js';
import { OKXUTXOSigner } from './signers/utxo.js';
import { suiWalletInstance } from './utils.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const utxoProvider = provider.get(UTXO_NAMESPACE);
  const tonProvider = provider.get(TON_NAMESPACE);
  const tronProvider = provider.get(TRON_NAMESPACE);

  const signers = new DefaultSignerFactory();
  const { DefaultTronSigner } = await import('@rango-dev/signer-tron');
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
