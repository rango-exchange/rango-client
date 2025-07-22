import type Solflare from '@solflare-wallet/sdk';
import type { GenericSigner, SolanaTransaction } from 'rango-types';

import { executeSolanaTransaction } from '@arlert-dev/signer-solana';
import base58 from 'bs58';

export class CustomSolanaSigner implements GenericSigner<SolanaTransaction> {
  private provider: any; // Used any instead of Solflare because there is an issue in type of `signTransaction` method of Solflare

  constructor(provider: Solflare) {
    this.provider = provider;
  }

  async signMessage(msg: string): Promise<string> {
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(msg);
    const messageSignature = await this.provider.signMessage(
      messageBytes,
      'utf8'
    );
    return base58.encode(messageSignature);
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    const hash = await executeSolanaTransaction(tx, this.provider);
    return { hash };
  }
}
