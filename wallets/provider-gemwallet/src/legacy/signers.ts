import type { Provider } from '../utils.js';
import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  _provider: Provider
): Promise<SignerFactory> {
  const { XrplSigner } = await import('./xrplSigner.js');
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.XRPL, new XrplSigner());
  return signers;
}
