import type { GenericSigner, StarknetTransaction } from 'rango-types';

import { SignerError, SignerErrorCode } from 'rango-types';

import { sendTransaction } from './helpers';

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

    try {
      for (const call of calls) {
        const res = await sendTransaction(
          this.provider,
          call.contractAddress,
          call.entrypoint,
          (call.calldata as string[]).toString(),
          address,
          chainId
        );
        console.log({ res });
      }

      return { hash: '' };
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
