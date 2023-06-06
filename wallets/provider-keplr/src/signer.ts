import { DefaultCosmosSigner } from '@rango-dev/signer-cosmos';
import { Network, getNetworkInstance } from '@rango-dev/wallets-shared';
import type { SignerFactory } from 'rango-types';
import Rango from 'rango-types';

// For cjs compatibility.
const { DefaultSignerFactory, TransactionType: TxType } = Rango;

export default function getSigners(provider: any): SignerFactory {
  const cosmosProvider = getNetworkInstance(provider, Network.COSMOS);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(
    TxType.COSMOS,
    new DefaultCosmosSigner(cosmosProvider)
  );
  return signers;
}
