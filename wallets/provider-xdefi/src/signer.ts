import type { SignerFactory } from 'rango-types';

import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { DefaultSolanaSigner } from '@rango-dev/signer-solana';
import { getNetworkInstance, Networks } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { CustomCosmosSigner } from './cosmos-signer.js';
import { CustomTransferSigner } from './utxo-signer.js';

export default function getSigners(provider: any): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);

  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  // passed provider for transfer as it comprises several signers
  signers.registerSigner(TxType.COSMOS, new CustomCosmosSigner(provider));
  // passed provider for transfer as it comprises several signers
  signers.registerSigner(TxType.TRANSFER, new CustomTransferSigner(provider));
  return signers;
}
