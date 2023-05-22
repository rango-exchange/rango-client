import { GenericSigner, CosmosTransaction } from 'rango-types';
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
    if (!chainId) throw Error('ChainId is required');
    const { result } = await this.provider.signBytes(msg, address);
    return result.signature;
  }

  async signAndSendTx(tx: CosmosTransaction): Promise<{ hash: string }> {
    const hash = await executeTerraTransaction(tx, this.provider);
    return { hash };
  }
}
