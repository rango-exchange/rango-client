import { EvmSigner } from '@rango-dev/signer-evm';
import { SignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const signers = new SignerFactory();
  signers.registerSigner(TxType.EVM, new EvmSigner(provider));
  return signers;
}
