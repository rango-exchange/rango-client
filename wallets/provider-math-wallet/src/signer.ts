import type { SignerFactory } from 'rango-types';

import { DefaultSolanaSigner } from '@arlert-dev/signer-solana';
import { getNetworkInstance, Networks } from '@arlert-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const cosmosProvider = getNetworkInstance(provider, Networks.COSMOS);

  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await import('@arlert-dev/signer-evm');
  const { MathWalletCosmosSigner } = await import('./signers/cosmosSigner.js');

  if (!!ethProvider) {
    signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  }
  if (!!solProvider) {
    signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  }
  if (!!cosmosProvider) {
    signers.registerSigner(
      TxType.COSMOS,
      new MathWalletCosmosSigner(cosmosProvider)
    );
  }

  return signers;
}
