import type { SolanaExternalProvider } from './utils/types.js';
import type { GenericSigner, SolanaTransaction } from 'rango-types';

import base58 from 'bs58';
import { SignerError, SignerErrorCode } from 'rango-types';

import { executeSolanaTransaction } from './utils/main.js';

export class DefaultSolanaSigner implements GenericSigner<SolanaTransaction> {
  private _provider: SolanaExternalProvider;

  constructor(provider: SolanaExternalProvider) {
    this._provider = provider;
  }

  get provider(): SolanaExternalProvider {
    return this._provider;
  }

  async signMessage(msg: string): Promise<string> {
    try {
      const encodedMessage = new TextEncoder().encode(msg);
      const { signature } = await this._provider.request({
        method: 'signMessage',
        params: {
          message: encodedMessage,
        },
      });
      return base58.encode(signature);
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    const hash = await executeSolanaTransaction(tx, this._provider);
    return { hash };
  }
}
