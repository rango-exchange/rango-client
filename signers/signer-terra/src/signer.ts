import type { CosmosTransaction, GenericSigner } from 'rango-types';

import { executeTerraTransaction } from './helpers';

type TerraExternalProvider = any;

export class DefaultTerraSigner implements GenericSigner<CosmosTransaction> {
  private provider: TerraExternalProvider;

  constructor(provider: TerraExternalProvider) {
    this.provider = provider;
  }

  async signMessage(
    msg: string,
    address: string,
    chainId: string | null
  ): Promise<string> {
    if (!chainId) {
      throw Error('ChainId is required');
    }
    const { result } = await this.provider.signBytes(
      Buffer.from(msg, 'utf-8'),
      address
    );
    return Buffer.from(result.signature).toString('base64');
  }

  async signAndSendTx(tx: CosmosTransaction): Promise<{ hash: string }> {
    const hash = await executeTerraTransaction(tx, this.provider);
    return { hash };
  }
}
