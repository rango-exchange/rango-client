import { DefaultSolanaSigner } from '@rango-dev/signer-solana';
import base58 from 'bs58';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SolanaExternalProvider = any;

export class CustomSolanaSigner extends DefaultSolanaSigner {
  constructor(provider: SolanaExternalProvider) {
    super(provider);
  }

  async signMessage(msg: string): Promise<string> {
    const { signature } = await this.provider.signMessage(msg);
    return base58.encode(signature);
  }
}
