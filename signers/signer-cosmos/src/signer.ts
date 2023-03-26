import { ISigner, CosmosTransaction } from 'rango-types';
import { executeCosmosTransaction } from './helpers';
import { Keplr } from '@keplr-wallet/types';

export interface ICosmosSigner extends ISigner<CosmosTransaction> {}

type CosmosExternalSigner = Keplr;

export class CosmosSigner implements ICosmosSigner {
  private signer: CosmosExternalSigner;

  constructor(signer: CosmosExternalSigner) {
    this.signer = signer;
  }

  async signMessage(
    msg: string,
    address: string,
    chainId: string | null
  ): Promise<string> {
    if (!chainId) throw Error('ChainId is required');
    const { signature } = await this.signer.signArbitrary(
      chainId,
      address,
      msg
    );
    return signature;
  }

  async signAndSendTx(tx: CosmosTransaction): Promise<string> {
    return await executeCosmosTransaction(tx, this.signer);
  }
}
