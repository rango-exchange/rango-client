import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { DefaultSolanaSigner } from '@rango-dev/signer-solana';
import { Network, getNetworkInstance } from '@rango-dev/wallets-shared';
import type { SignerFactory } from 'rango-types';
import Rango from 'rango-types';

// For cjs compatibility.
const { DefaultSignerFactory, TransactionType: TxType } = Rango;
import { CustomCosmosSigner } from './cosmos-signer';
import { CustomTransferSigner } from './utxo-signer';

export default function getSigners(provider: any): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Network.ETHEREUM);
  const solProvider = getNetworkInstance(provider, Network.SOLANA);
  const cosmosProvider = getNetworkInstance(provider, Network.COSMOS);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  signers.registerSigner(TxType.COSMOS, new CustomCosmosSigner(cosmosProvider));
  // passed provider for transfer as it comprises several signers
  signers.registerSigner(TxType.TRANSFER, new CustomTransferSigner(provider));
  return signers;
}
