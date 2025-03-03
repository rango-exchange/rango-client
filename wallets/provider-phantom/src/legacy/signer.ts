import type { SignerFactory } from 'rango-types';

import { LegacyNetworks as Networks } from '@rango-dev/wallets-core/legacy';
import { getInstanceOrThrow } from '@rango-dev/wallets-core/namespaces/sui';
import { getNetworkInstance } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { WALLET_NAME_IN_WALLET_STANDARD } from '../constants.js';

export default async function getSigners(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any
): Promise<SignerFactory> {
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const evmProvider = getNetworkInstance(provider, Networks.ETHEREUM);

  // TODO: This goes through error if SUI disabled
  const suiProvider = getInstanceOrThrow(WALLET_NAME_IN_WALLET_STANDARD);

  const { DefaultEvmSigner } = await import('@rango-dev/signer-evm');
  const { DefaultSolanaSigner } = await import('@rango-dev/signer-solana');
  const { DefaultSuiSigner } = await import('@rango-dev/signer-sui');
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(evmProvider));
  signers.registerSigner(TxType.MOVE, new DefaultSuiSigner(suiProvider));
  return signers;
}
