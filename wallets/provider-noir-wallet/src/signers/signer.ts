import type { Transfer } from 'rango-types/mainApi';

import { isZcashBlockchain } from '@rango-dev/wallets-shared';
import { BigNumber } from 'bignumber.js';
import { type GenericSigner, SignerError, SignerErrorCode } from 'rango-types';

import { getInstanceOrThrow } from '../utils.js';

export class CustomUtxoSigner implements GenericSigner<Transfer> {
  async signMessage(msg: string): Promise<string> {
    const noirWallet = getInstanceOrThrow();
    const zcash = noirWallet.zcash;

    const result = await zcash.signMessage(msg);
    return result.signature;
  }

  async signAndSendTx(tx: Transfer): Promise<{ hash: string }> {
    const { memo, recipientAddress, amount, decimals, blockChain } = tx;

    if (!isZcashBlockchain(blockChain)) {
      throw new Error(`You can not sign ${tx.blockChain} using ZCash signer.`);
    }

    if (memo) {
      throw new SignerError(
        SignerErrorCode.UNEXPECTED_BEHAVIOUR,
        'Noir Wallet can not attach a protocol memo (OP_RETURN) to a Zcash transaction.',
        undefined
      );
    }

    /*
     * Rango provides `amount` in the asset's smallest unit (zatoshis), but the
     * Noir Wallet expects a decimal ZEC string. Shift by `-decimals` to convert
     * (e.g. "1000000" zatoshis -> "0.01" ZEC).
     */
    const amountInZec = new BigNumber(amount).shiftedBy(-decimals).toFixed();

    try {
      const noirWallet = getInstanceOrThrow();
      const zcash = noirWallet.zcash;

      const txid = await zcash.sendTransaction({
        to: recipientAddress,
        amount: amountInZec,
        fundingSource: 'transparent',
      });
      return { hash: txid };
    } catch (error) {
      if (typeof error === 'string') {
        throw new SignerError(
          SignerErrorCode.UNEXPECTED_BEHAVIOUR,
          error,
          undefined
        );
      }
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
    }
  }
}
