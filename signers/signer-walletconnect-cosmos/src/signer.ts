import type { GenericSigner, CosmosTransaction } from 'rango-types';
import { CosmosRpcResponse, executeCosmosTransaction } from './helpers';
import { IUniversalProvider } from '@walletconnect/universal-provider';

type CosmosExternalProvider = IUniversalProvider;

export class DefaultWalletconnectCosmosSigner
  implements GenericSigner<CosmosTransaction>
{
  private provider: CosmosExternalProvider;

  constructor(provider: CosmosExternalProvider) {
    this.provider = provider;
  }

  async signMessage(
    msg: string,
    address: string,
    chainId: string | null
  ): Promise<string> {
    console.log('hello', this.provider);

    if (!chainId) throw Error('ChainId is required');
    const { signature } = await this.provider.request<CosmosRpcResponse>({
      method: 'cosmos_signDirect',
      params: {
        signerAddress: address,
        signDoc: msg,
      },
    });
    return signature;
  }

  async signAndSendTx(tx: CosmosTransaction): Promise<{ hash: string }> {
    const hash = await executeCosmosTransaction(tx, this.provider);
    return { hash };
  }
}
