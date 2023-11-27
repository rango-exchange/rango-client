import type { GenericSigner, StarknetTransaction } from 'rango-types';
import type { InvocationsSignerDetails } from 'starknet';

import { SignerError, SignerErrorCode } from 'rango-types';
import { Signer } from 'starknet';

import { getAddressKeyDeriver, getKeysFromAddress } from './helpers';

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
    /*
     * const
     * const { privateKey } = await getKeysFromAddress(keyDeriver, network, state, signerAddress);
     */

    // console.log({ tx, chainId, address, calls, privateKey });
    const transactionsDetail = {
      walletAddress: address,
      chainId,
    };

    try {
      const keyDeriver = await getAddressKeyDeriver(this.provider);
      const { privateKey } = await getKeysFromAddress(
        this.provider,
        keyDeriver,
        chainId as string,
        address
      );

      console.log({ privateKey });

      const signer = new Signer(privateKey);
      const signatures = await signer.signTransaction(
        calls,
        transactionsDetail as InvocationsSignerDetails
      );
      console.log(signatures);

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
