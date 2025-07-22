import { DefaultSolanaSigner } from '@arlert-dev/signer-solana';
import base58 from 'bs58';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SolanaExternalProvider = any;

export class CustomSolanaSigner extends DefaultSolanaSigner {
  constructor(provider: SolanaExternalProvider) {
    super(provider);
  }

  async signMessage(msg: string): Promise<string> {
    const encodedMessage = new TextEncoder().encode(msg);
    const { signature } = await this.provider.signMessage(encodedMessage);
    return base58.encode(signature);
  }
}
