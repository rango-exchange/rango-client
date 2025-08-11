import type { TonConnectUI } from '@tonconnect/ui';
import type { SignerFactory } from 'rango-types';

import { retryLazyImport } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: TonConnectUI
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { CustomTonSigner } = await retryLazyImport(
    async () => await import('./ton-signer.js')
  );
  signers.registerSigner(TxType.TON, new CustomTonSigner(provider));
  return signers;
}
