import type { SolanaExternalProvider } from './utils/types';
import type { GenericSigner, SolanaTransaction } from 'rango-types';

import { SignerError, SignerErrorCode } from 'rango-types';

import { executeSolanaTransaction } from './utils/main';

export class DefaultSolanaSigner implements GenericSigner<SolanaTransaction> {
  private provider: SolanaExternalProvider;

  constructor(provider: SolanaExternalProvider) {
    this.provider = provider;
  }

  async signMessage(msg: string): Promise<string> {
    try {
      const encodedMessage = new TextEncoder().encode(msg);
      const { signature } = await this.provider.request({
        method: 'signMessage',
        params: {
          message: encodedMessage,
        },
      });
      return signature;
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    const hash = await executeSolanaTransaction(tx, this.provider);
    return { hash };
  }
}
