import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { Networks, getNetworkInstance } from '@rango-dev/wallets-shared';
import {
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  console.log({ provider });
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  console.log({ ethProvider });
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  return signers;
}
