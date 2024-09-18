import type { SignerFactory } from 'rango-types';

import { getNetworkInstance, Networks } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);

  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await import('@rango-dev/signer-evm');
  const { DefaultSolanaSigner } = await import('@rango-dev/signer-solana');
  const { CustomCosmosSigner } = await import('./cosmos-signer.js');
  const { CustomTransferSigner } = await import('./utxo-signer.js');

  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  // passed provider for transfer as it comprises several signers
  signers.registerSigner(TxType.COSMOS, new CustomCosmosSigner(provider));
  // passed provider for transfer as it comprises several signers
  signers.registerSigner(TxType.TRANSFER, new CustomTransferSigner(provider));
  return signers;
}
