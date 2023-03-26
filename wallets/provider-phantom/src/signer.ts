import { SolanaSigner } from '@rango-dev/signer-solana';
import { Network, getNetworkInstance } from '@rango-dev/wallets-shared';
import { SignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const solProvider = getNetworkInstance(provider, Network.SOLANA);
  const signers = new SignerFactory();
  signers.registerSigner(TxType.SOLANA, new SolanaSigner(solProvider));
  return signers;
}
