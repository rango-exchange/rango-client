import type { GenericSigner, TonTransaction } from 'rango-types';

import { Address, Cell } from '@ton/core';
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
    const { type, blockChain, from, messages, ...rest } = tx;

    const transactionObjectForSign = {
      ...rest,
      ...(from && { from: Address.parse(from).toRawString() }),
      messages: messages.map(({ stateInit, payload, ...msg }) => ({
        ...msg,
        ...(stateInit != null && { stateInit }),
        ...(payload != null && { payload }),
      })),
    };

    const { result } = await this.provider.send({
      method: 'sendTransaction',
      params: [JSON.stringify(transactionObjectForSign)],
    });

    const hash = Cell.fromBase64(result).hash().toString('hex');
    return { hash };
  }
}
