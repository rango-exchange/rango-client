import { DefaultSolanaSigner } from '@rango-dev/signer-solana';
import { Network, getNetworkInstance } from '@rango-dev/wallets-shared';
import type { SignerFactory } from 'rango-types';
import Rango from 'rango-types';

// For cjs compatibility.
const { DefaultSignerFactory, TransactionType: TxType } = Rango;

export default function getSigners(provider: any): SignerFactory {
  const solProvider = getNetworkInstance(provider, Network.SOLANA);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  return signers;
}
