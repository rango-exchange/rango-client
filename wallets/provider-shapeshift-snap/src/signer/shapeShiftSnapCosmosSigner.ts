/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { CosmosTransaction, GenericSigner } from 'rango-types';

import { walletInvokeSnap } from '@rango-dev/wallets-shared';
import { SignerError, SignerErrorCode } from 'rango-types';

import { DEFAULT_SNAP_ID } from '../helpers';

const signCosmosTransaction = async (instance: any, tx: CosmosTransaction) => {
  const signedTx = await walletInvokeSnap({
    instance,
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: {
        method: 'cosmos_signTransaction',
        params: {
          transaction: {
            addressNList: [
              0x80000000 + 44,
              0x80000000 + 118,
              0x80000000 + 0,
              0,
              0,
            ],
            chain_id: tx.data.chainId,
            account_number: tx.data.account_number,
            sequence: tx.data.sequence,
            tx: {
              fee: tx.data.fee,
              memo: tx.data.memo,
              msg: tx.data.msgs,
            },
          },
        },
      },
    },
  });

  return signedTx;
};

const broadcastCosmosTransaction = async (instance: any, signedTx: any) => {
  const result = await fetch('https://api.cosmos.shapeshift.com/api/v1/send', {
    method: 'POST',
    body: JSON.stringify({
      rawTx: signedTx.serialized,
    }),
  });

  const resultJson = await result.json();
  return resultJson;
};

class ShapeShiftSnapCosmosSigner implements GenericSigner<CosmosTransaction> {
  private provider: any;

  constructor(provider: any) {
    this.provider = provider;
  }

  public async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: CosmosTransaction): Promise<{ hash: string }> {
    try {
      const signedTx = await signCosmosTransaction(this.provider, tx);
      const result = await broadcastCosmosTransaction(this.provider, signedTx);

      return { hash: result };
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

export default ShapeShiftSnapCosmosSigner;
