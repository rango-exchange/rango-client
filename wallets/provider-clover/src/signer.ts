import type { SignerFactory } from 'rango-types';

import { getNetworkInstance, Networks } from '@rango-dev/wallets-shared';
import { PublicKey } from '@solana/web3.js';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { CustomSolanaSigner } from './solana-signer.js';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  //
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const solAccountAddress = await solProvider.getAccount();
  const proxiedSolProvider = new Proxy(solProvider, {
    get(target, prop, rec) {
      if (prop === 'publicKey') {
        return new PublicKey(solAccountAddress);
      }

      return Reflect.get(target, prop, rec);
    },
  });

  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await import('@rango-dev/signer-evm');
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(
    TxType.SOLANA,
    new CustomSolanaSigner(proxiedSolProvider)
  );
  return signers;
}
