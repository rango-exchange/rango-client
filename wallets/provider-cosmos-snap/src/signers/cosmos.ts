/* eslint-disable @typescript-eslint/no-magic-numbers */

import type { GenericSigner } from 'rango-types';
import type { CosmosTransaction } from 'rango-types/lib/api/main';

import { DEFAULT_SNAP_ID, executeTransaction } from './helpers';

export class DefaultCosmosSnapSigner
  implements GenericSigner<CosmosTransaction>
{
  private provider: any;
  constructor(provider: any) {
    this.provider = provider;
  }
  async signMessage(
    msg: string,
    _address: string,
    chainId: string | null
  ): Promise<string> {
    if (!chainId) {
      throw Error('ChainId is required');
    }
    const result = await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: DEFAULT_SNAP_ID,
        request: {
          method: 'txAlert',
          params: {
            chain_id: chainId,
            hash: msg,
          },
        },
      },
    });
    return result.data;
  }

  async signAndSendTx(tx: CosmosTransaction): Promise<{ hash: string }> {
    const hash = await executeTransaction(tx, this.provider);
    return { hash };
  }
}
