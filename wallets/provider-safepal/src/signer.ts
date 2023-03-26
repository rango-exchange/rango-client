import { EvmSigner } from '@rango-dev/signer-evm';
import { SolanaSigner } from '@rango-dev/signer-solana';
import { Network, getNetworkInstance } from '@rango-dev/wallets-shared';
import { SignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Network.ETHEREUM);
  const solProvider = getNetworkInstance(provider, Network.SOLANA);
  const signers = new SignerFactory();
  signers.registerSigner(TxType.EVM, new EvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new SolanaSigner(solProvider));
  return signers;
}
