import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { Network, getNetworkInstance } from '@rango-dev/wallets-shared';
import type { SignerFactory } from 'rango-types';
import { CustomSolanaSigner } from './solana-signer';
import Rango from 'rango-types';

// For cjs compatibility.
const { DefaultSignerFactory, TransactionType: TxType } = Rango;

export default function getSigners(provider: any): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Network.ETHEREUM);
  const solProvider = getNetworkInstance(provider, Network.SOLANA);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new CustomSolanaSigner(solProvider));
  return signers;
}
