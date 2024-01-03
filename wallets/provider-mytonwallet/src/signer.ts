import {
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from 'rango-types';
import { DefaultTonSigner } from '@yeager-dev/signer-ton';
import { TonProvider } from './types';

export default function getSigners(provider: TonProvider): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.TON, new DefaultTonSigner(provider));
  return signers;
}
