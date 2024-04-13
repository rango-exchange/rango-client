import type { SignerFactory } from 'rango-types';

import { DefaultSolanaSigner } from '@rango-dev/signer-solana';
import { getNetworkInstance, Networks } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { PhantomTransferSigner } from './signers/bitcoinSigner';

export default function getSigners(provider: any): SignerFactory {
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const bitcoinProvider = getNetworkInstance(provider, Networks.BTC);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  signers.registerSigner(
    TxType.TRANSFER,
    new PhantomTransferSigner(bitcoinProvider)
  );
  return signers;
}
