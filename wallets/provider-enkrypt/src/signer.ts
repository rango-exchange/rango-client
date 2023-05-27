import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { DefaultSignerFactory } from 'rango-types';
import { SignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(provider));
  return signers;
}
