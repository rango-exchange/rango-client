import type { DefaultSignerFactory, SignerFactory } from 'rango-types';

import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { getNetworkInstance, Networks } from '@rango-dev/wallets-shared';
import { TransactionType as TxType } from 'rango-types';

import { CustomSolanaSigner } from './solana-signer';

export default function getSigners(
  provider: any,
  defaultSigners: DefaultSignerFactory
): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const signers = defaultSigners;
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new CustomSolanaSigner(solProvider));
  return signers;
}
