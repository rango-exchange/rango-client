import type { SolanaExternalProvider } from '@rango-dev/signer-solana';

import { DefaultSolanaSigner } from '@rango-dev/signer-solana';
import base58 from 'bs58';

/**
 * Ctrl's Solana provider signs messages via a direct `signMessage(bytes)` call
 * (the standard wallet-adapter shape). `DefaultSolanaSigner` signs through
 * `request({ method: 'signMessage' })`, which Ctrl does not support, so we keep the
 * direct call and inherit everything else (incl. base58 output and `signAndSendTx`).
 */
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
