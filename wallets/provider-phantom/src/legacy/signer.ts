import type { SignerFactory } from 'rango-types';

import { LegacyNetworks as Networks } from '@rango-dev/wallets-core/legacy';
import { getNetworkInstance } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const evmProvider = getNetworkInstance(provider, Networks.ETHEREUM);

  const { DefaultEvmSigner } = await import('@rango-dev/signer-evm');
  const { DefaultSolanaSigner } = await import('@rango-dev/signer-solana');
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(evmProvider));
  return signers;
}
