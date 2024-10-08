import type { SignerFactory } from 'rango-types';

import { getNetworkInstance, Networks } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const btcProvider = getNetworkInstance(provider, Networks.BTC);
  const signers = new DefaultSignerFactory();
  const { DefaultSolanaSigner } = await import('@rango-dev/signer-solana');
  const { BTCSigner } = await import('./signers/btc.js');
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  signers.registerSigner(TxType.TRANSFER, new BTCSigner(btcProvider));
  return signers;
}
