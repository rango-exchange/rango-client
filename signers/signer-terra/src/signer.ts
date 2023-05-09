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
    const { signature } = await this.provider.signArbitrary(
      chainId,
      address,
      msg
    );
    return signature;
  }

  async signAndSendTx(tx: CosmosTransaction): Promise<string> {
    return await executeTerraTransaction(tx, this.provider);
  }
}
