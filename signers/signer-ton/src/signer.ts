import type { GenericSigner, TonMessage, TonTransaction } from 'rango-types';

import { Address, Cell } from '@ton/core';
import { SignerError, TonChainID } from 'rango-types';

export type TonTransactionPayload = {
  valid_until: number;
  network: TonChainID;
  from?: string;
  messages: TonMessage[];
};

export class DefaultTonSigner implements GenericSigner<TonTransaction> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private provider: any) {
    this.provider = provider;
  }

  static buildTx(tonTx: TonTransaction): TonTransactionPayload {
    const { validUntil, network, from, messages } = tonTx;

    let tx: TonTransactionPayload = {
      valid_until: validUntil,
      network: network ?? TonChainID.MAINNET,
      messages: messages.map(({ address, amount, stateInit, payload }) => ({
        address,
        amount,
        ...(stateInit != null && { stateInit }),
        ...(payload != null && { payload }),
      })),
    };
    if (from) {
      tx = { ...tx, from: Address.parse(from).toRawString() };
    }
    return tx;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: TonTransaction): Promise<{ hash: string }> {
    const { result } = await this.provider.send({
      method: 'sendTransaction',
      params: [JSON.stringify(DefaultTonSigner.buildTx(tx))],
    });

    const hash = Cell.fromBase64(result).hash().toString('hex');
    return { hash };
  }
}
