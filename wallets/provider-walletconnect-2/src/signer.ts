import {
  // BlockchainMeta,
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from 'rango-types';
import { CustomSolanaSigner } from './solana-signer';
// import { CustomCosmosSigner } from './cosmos-signer';
// import { DefaultEvmSigner } from '@rango-dev/signer-evm';

export default function getSigners(
  provider: any
  // supportedChains: BlockchainMeta[]
): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.SOLANA, new CustomSolanaSigner(provider));
  // signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  // signers.registerSigner(
  //   TxType.COSMOS,
  //   new CustomCosmosSigner(provider, supportedChains)
  // );
  return signers;
}
