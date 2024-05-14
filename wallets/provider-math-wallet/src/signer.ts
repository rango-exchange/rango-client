import type { DefaultSignerFactory, SignerFactory } from 'rango-types';

import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { DefaultSolanaSigner } from '@rango-dev/signer-solana';
import { getNetworkInstance, Networks } from '@rango-dev/wallets-shared';
import { TransactionType as TxType } from 'rango-types';

import { MathWalletCosmosSigner } from './signers/cosmosSigner';

export default function getSigners(
  provider: any,
  defaultSigners: DefaultSignerFactory
): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const cosmosProvider = getNetworkInstance(provider, Networks.COSMOS);

  const signers = defaultSigners;

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
