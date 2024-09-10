import type Solflare from '@solflare-wallet/sdk';
import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { CustomSolanaSigner } from './signers/solanaSigner.js';

export default function getSigners(provider: Solflare): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.SOLANA, new CustomSolanaSigner(provider));
  return signers;
}
