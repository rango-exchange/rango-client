import type { TonConnectUI } from '@tonconnect/ui';
import type { GenericSigner, TonTransaction } from 'rango-types';

import { Cell } from '@ton/core';
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
    const { blockChain, type, ...txObjectForSign } = tx;
    const result = await this.provider.sendTransaction({
      ...txObjectForSign,
      network: CHAIN.MAINNET,
    });

    const hash = Cell.fromBase64(result.boc).hash().toString('hex');
    return { hash };
  }
}
