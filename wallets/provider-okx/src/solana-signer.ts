import { DefaultSolanaSigner } from '@arlert-dev/signer-solana';
import { SignerError, SignerErrorCode } from 'rango-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SolanaExternalProvider = any;

export class CustomSolanaSigner extends DefaultSolanaSigner {
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
