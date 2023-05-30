import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { DefaultSignerFactory, SignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(provider));
  return signers;
}
