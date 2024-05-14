import type { DefaultSignerFactory, SignerFactory } from 'rango-types';

import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { getNetworkInstance, Networks } from '@rango-dev/wallets-shared';
import { TransactionType as TxType } from 'rango-types';

export default function getSigners(
  provider: any,
  defaultSigners: DefaultSignerFactory
): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const signers = defaultSigners;
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  return signers;
}
