import type { GenericSigner, Transfer } from 'rango-types';

import { walletInvokeSnap } from '@rango-dev/wallets-shared';
import { SignerError, SignerErrorCode } from 'rango-types';

import { DEFAULT_SNAP_ID } from '../helpers';

class ShapeShiftSnapBaseSigner implements GenericSigner<Transfer> {
  private provider: any;

  constructor(provider: any) {
    this.provider = provider;
  }

  public async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(
    tx: Transfer,
    address: string
  ): Promise<{ hash: string }> {
    try {
      const temp1 = await fetch(
        `https://api.litecoin.shapeshift.com/api/v1/account/${address}/utxos`,
        {
          method: 'GET',
        }
      );
      const temp1Json = await temp1.json();

      const temp2 = await fetch(
        `https://api.litecoin.shapeshift.com/api/v1/tx/${temp1Json?.[0]?.txid}`,
        {
          method: 'GET',
        }
      );
      const temp2Json = await temp2.json();

      const signresult = await walletInvokeSnap({
        instance: this.provider,
        params: {
          snapId: DEFAULT_SNAP_ID,
          request: {
            method: 'ltc_signTransaction',
            params: {
              transaction: {
                coin: 'Litecoin',
                inputs: [
                  {
                    addressNList: temp1Json?.[0]?.path,
                    scriptType: 'p2pkh',
                    amount: temp1Json?.[0]?.value,
                    vout: temp1Json?.[0]?.vout,
                    txid: temp1Json?.[0]?.txid,
                    hex: temp2Json?.hex,
                  },
                ],
                outputs: [
                  {
                    addressType: 'spend',
                    amount: tx.amount,
                    address: tx.recipientAddress,
                  },
                  {
                    addressType: 'change',
                    amount: (
                      temp1Json?.[0]?.value - parseInt(tx.amount)
                    ).toString(),
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    addressNList: [2147483692, 2147483650, 2147483648, 1, 0],
                    scriptType: 'p2pkh',
                    isChange: true,
                  },
                ],
                opReturnData: tx.memo,
              },
            },
          },
        },
      });

      console.log(signresult);

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

export default ShapeShiftSnapBaseSigner;
