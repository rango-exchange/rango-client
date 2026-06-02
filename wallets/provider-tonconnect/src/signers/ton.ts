import type { TonConnectUI } from '@tonconnect/ui';
import type { GenericSigner, TonTransaction } from 'rango-types';

import { Address, Cell } from '@ton/core';
import { CHAIN } from '@tonconnect/ui';
import { SignerError } from 'rango-types';

export class CustomTonSigner implements GenericSigner<TonTransaction> {
  private provider: TonConnectUI;

  constructor(provider: TonConnectUI) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: TonTransaction): Promise<{ hash: string }> {
    const { blockChain, type, from, messages, ...rest } = tx;
    const result = await this.provider.sendTransaction({
      ...rest,
      ...(from && { from: Address.parse(from).toRawString() }),
      messages: messages.map(({ stateInit, payload, ...msg }) => ({
        ...msg,
        ...(stateInit != null && { stateInit }),
        ...(payload != null && { payload }),
      })),
      network: CHAIN.MAINNET,
    });

    const hash = Cell.fromBase64(result.boc).hash().toString('hex');
    return { hash };
  }
}
