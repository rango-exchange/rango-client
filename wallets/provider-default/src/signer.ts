import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await import('@arlert-dev/signer-evm');
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(provider));
  return signers;
}
