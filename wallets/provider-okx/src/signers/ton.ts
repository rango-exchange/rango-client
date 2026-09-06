import type {
  TonConnectWalletResponseError,
  TonProviderApi,
} from '../namespaces/ton/types.js';
import type { GenericSigner, TonTransaction } from 'rango-types';

import { DefaultTonSigner } from '@rango-dev/signer-ton';
import { SignerError, SignerErrorCode } from 'rango-types';

import { TON_CONNECT_USER_REJECTED_CODE } from '../constants.js';
import { nextTonRequestId } from '../namespaces/ton/utils.js';

function toSignerError(response: TonConnectWalletResponseError): SignerError {
  const code =
    response.error.code === TON_CONNECT_USER_REJECTED_CODE
      ? SignerErrorCode.REJECTED_BY_USER
      : SignerErrorCode.SEND_TX_ERROR;
  return new SignerError(code, response.error.message, response.error);
}

export class OKXTonSigner implements GenericSigner<TonTransaction> {
  private provider: TonProviderApi;

  constructor(provider: TonProviderApi) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: TonTransaction): Promise<{ hash: string }> {
    const { Cell } = await import('@ton/core');

    const transactionPayload = DefaultTonSigner.buildTx(tx);

    try {
      const response = await this.provider.send({
        method: 'sendTransaction',
        params: [JSON.stringify(transactionPayload)],
        id: nextTonRequestId(),
      });

      if ('error' in response) {
        throw toSignerError(response);
      }

      const hash = Cell.fromBase64(response.result).hash().toString('hex');
      return { hash };
    } catch (error) {
      if (error instanceof SignerError) {
        throw error;
      }
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
    }
  }
}
