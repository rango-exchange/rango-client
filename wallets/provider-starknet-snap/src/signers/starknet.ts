import type { GenericSigner, StarknetTransaction } from 'rango-types';

import { SignerError, SignerErrorCode } from 'rango-types';

import { DEFAULT_SNAP_ID } from '../helpers';

class StarknetSigner implements GenericSigner<StarknetTransaction> {
  private provider: any;

  constructor(provider: any) {
    this.provider = provider;
  }

  public async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(
    tx: StarknetTransaction,
    address: string,
    chainId: string | null
  ): Promise<{ hash: string }> {
    const { calls } = tx;
    console.log({ tx, chainId, address });

    try {
      const response = await this.provider.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: DEFAULT_SNAP_ID,
          request: {
            method: 'starkNet_sendTransaction',
            params: {
              senderAddress: address,
              calls: calls,
              chainId,
            },
          },
        },
      });
      return response;
    } catch (err) {
      console.log({ err });

      if (SignerError.isSignerError(err)) {
        throw err;
      } else {
        throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, err);
      }
    }
  }
}

export default StarknetSigner;
