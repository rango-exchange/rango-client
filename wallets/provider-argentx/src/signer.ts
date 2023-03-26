import { StarknetSigner } from '@rango-dev/signer-starknet';
import { SignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const signers = new SignerFactory();
  signers.registerSigner(TxType.STARKNET, new StarknetSigner(provider));
  return signers;
}
