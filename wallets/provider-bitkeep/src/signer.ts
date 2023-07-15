import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { DefaultTronSigner } from '@rango-dev/signer-tron';
import { Networks, getNetworkInstance } from '@rango-dev/wallets-shared';
import {
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const tronProvider = getNetworkInstance(provider, Networks.TRON);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(tronProvider));
  return signers;
}
