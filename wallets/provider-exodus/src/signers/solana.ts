import {
  DefaultSolanaSigner,
  type SolanaExternalProvider,
} from '@rango-dev/signer-solana';
import base58 from 'bs58';

export class ExodusSolanaSigner extends DefaultSolanaSigner {
  constructor(provider: SolanaExternalProvider) {
    super(provider);
  }

  async signMessage(msg: string): Promise<string> {
    const { signature } = await this.provider.signMessage(msg);
    return base58.encode(signature);
  }
}
