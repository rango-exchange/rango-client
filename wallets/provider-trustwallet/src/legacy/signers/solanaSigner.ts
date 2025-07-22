import { DefaultSolanaSigner } from '@arlert-dev/signer-solana';
import base58 from 'bs58';

export class CustomSolanaSigner extends DefaultSolanaSigner {
  async signMessage(msg: string): Promise<string> {
    const signature = (await this.provider.signMessage(msg))?.signature;
    return base58.encode(signature);
  }
}
