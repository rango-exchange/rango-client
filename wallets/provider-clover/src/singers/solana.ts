import {
  DefaultSolanaSigner,
  type SolanaExternalProvider,
} from '@rango-dev/signer-solana';
import base58 from 'bs58';

export class CloverSolanaSigner extends DefaultSolanaSigner {
  constructor(provider: SolanaExternalProvider) {
    super(provider);
  }

  async signMessage(msg: string): Promise<string> {
    const encodedMessage = new TextEncoder().encode(msg);
    const { signature } = await this.provider.signMessage(encodedMessage);
    return base58.encode(signature);
  }
}
