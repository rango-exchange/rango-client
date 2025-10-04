import {
  DefaultSolanaSigner,
  type SolanaExternalProvider,
} from '@rango-dev/signer-solana';
import { SignerError, SignerErrorCode } from 'rango-types';

export class OKXSolanaSigner extends DefaultSolanaSigner {
  constructor(provider: SolanaExternalProvider) {
    super(provider);
  }

  async signMessage(msg: string): Promise<string> {
    try {
      const { signature } = await this.provider.request({
        method: 'signMessage',
        params: {
          message: msg,
        },
      });
      return signature;
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }
}
