import {
  DefaultSolanaSigner,
  type SolanaExternalProvider,
} from '@rango-dev/signer-solana';
import base58 from 'bs58';

export class SolflareSolanaSiger extends DefaultSolanaSigner {
  constructor(provider: SolanaExternalProvider) {
    super(provider);
  }

  async signMessage(msg: string): Promise<string> {
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(msg);
    // Used any instead of Solflare because there is an issue in type of `signTransaction` method of Solflare
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messageSignature = await (this.provider as any).signMessage(
      messageBytes,
      'utf8'
    );

    return base58.encode(messageSignature.signature);
  }
}
