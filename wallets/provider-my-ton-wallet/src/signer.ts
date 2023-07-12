import { Networks, getNetworkInstance } from '@rango-dev/wallets-shared';
import {
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from 'rango-types';
import { TonSigner } from './ton-singer';

export default function getSigners(provider: any): SignerFactory {
  const tonProvider = getNetworkInstance(provider, Networks.TON);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.TON, new TonSigner(tonProvider));
  return signers;
}
