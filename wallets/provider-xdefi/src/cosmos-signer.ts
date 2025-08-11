import type { ProviderAPI } from '@rango-dev/wallets-core/namespaces/cosmos';
import type { CosmosTransaction, GenericSigner } from 'rango-types';

import {
  getNetworkInstance,
  Networks,
  retryLazyImport,
} from '@rango-dev/wallets-shared';
import { SignerError, SignerErrorCode } from 'rango-types';

type CosmosExternalProvider = ProviderAPI;

export class CustomCosmosSigner implements GenericSigner<CosmosTransaction> {
  private provider: CosmosExternalProvider;
  constructor(provider: CosmosExternalProvider) {
    this.provider = provider;
  }

  async signMessage(
    msg: string,
    address: string,
    chainId: string | null
  ): Promise<string> {
    try {
      if (!chainId) {
        throw Error('ChainId is required');
      }
      const { signature } = await this.provider.signArbitrary(
        chainId,
        address,
        msg
      );
      return signature;
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }
  async signAndSendTx(tx: CosmosTransaction): Promise<{ hash: string }> {
    const { executeCosmosTransaction } = await retryLazyImport(
      async () => await import('@rango-dev/signer-cosmos')
    );

    if (tx.rawTransfer === null) {
      const cosmosProvider = getNetworkInstance(this.provider, Networks.COSMOS);
      const hash = await executeCosmosTransaction(tx, cosmosProvider);
      return { hash };
    }
    throw Error('raw transfer is not null for cosmos transactions');
  }
}
