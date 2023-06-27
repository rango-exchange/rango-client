import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { Networks, getNetworkInstance } from '@rango-dev/wallets-shared';
import {
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const tonProvider = getNetworkInstance(provider, Networks.TON);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(tonProvider));
  return signers;
}
