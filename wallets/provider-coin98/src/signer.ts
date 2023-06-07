import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { Network, getNetworkInstance } from '@rango-dev/wallets-shared';
import {
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from 'rango-types';
import { CustomSolanaSigner } from './solana-signer';

export default function getSigners(provider: any): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Network.ETHEREUM);
  const solProvider = getNetworkInstance(provider, Network.SOLANA);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new CustomSolanaSigner(solProvider));
  return signers;
}
