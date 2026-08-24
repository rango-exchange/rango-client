import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { EVM_NAMESPACE, SOLANA_NAMESPACE } from '@hub3js/namespaces';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { MetamaskSolanaSigner } from './signers/solana.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const ethProvider = provider.get(EVM_NAMESPACE);
  const solanaProvider = provider.get(SOLANA_NAMESPACE);

  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await import('@rango-dev/signer-evm');
  if (!!ethProvider) {
    signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  }
  if (!!solanaProvider) {
    signers.registerSigner(
      TxType.SOLANA,
      new MetamaskSolanaSigner(solanaProvider)
    );
  }
  return signers;
}
