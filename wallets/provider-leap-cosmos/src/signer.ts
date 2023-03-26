import { CosmosSigner } from '@rango-dev/signer-cosmos';
import { Network, getNetworkInstance } from '@rango-dev/wallets-shared';
import { SignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const cosmosProvider = getNetworkInstance(provider, Network.COSMOS);
  const signers = new SignerFactory();
  signers.registerSigner(TxType.COSMOS, new CosmosSigner(cosmosProvider));
  return signers;
}
