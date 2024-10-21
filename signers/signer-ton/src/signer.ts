import type { GenericSigner, TonTransaction } from 'rango-types';

import { Cell } from '@ton/core';
import { SignerError } from 'rango-types';

export class DefaultTonSigner implements GenericSigner<TonTransaction> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private provider: any) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: TonTransaction): Promise<{ hash: string }> {
    const { type, blockChain, ...transactionObjectForSign } = tx;

    const { result } = await this.provider.send({
      method: 'sendTransaction',
      params: [JSON.stringify(transactionObjectForSign)],
    });

    const hash = Cell.fromBase64(result).hash().toString('hex');
    return { hash };
  }
}
