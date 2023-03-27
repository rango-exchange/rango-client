import { ISigner, CosmosTransaction } from 'rango-types';
import { executeCosmosTransaction } from './helpers';
import { Keplr } from '@keplr-wallet/types';

export interface ICosmosSigner extends ISigner<CosmosTransaction> {}

type CosmosExternalProvider = Keplr;

export class CosmosSigner implements ICosmosSigner {
  private provider: CosmosExternalProvider;

  constructor(provider: CosmosExternalProvider) {
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
    return await executeCosmosTransaction(tx, this.provider);
  }
}
