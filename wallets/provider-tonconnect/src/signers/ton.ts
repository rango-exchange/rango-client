import type { TonConnectUI } from '@tonconnect/ui';
import type { GenericSigner, TonTransaction } from 'rango-types';

import { DefaultTonSigner } from '@rango-dev/signer-ton';
import { Cell } from '@ton/core';
import { CHAIN } from '@tonconnect/ui';
import { SignerError, TonChainID } from 'rango-types';

const NETWORKS: Record<TonChainID, CHAIN> = {
  [TonChainID.MAINNET]: CHAIN.MAINNET,
  [TonChainID.TESTNET]: CHAIN.TESTNET,
};

export class CustomTonSigner implements GenericSigner<TonTransaction> {
  private provider: TonConnectUI;

  constructor(provider: TonConnectUI) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: TonTransaction): Promise<{ hash: string }> {
    const transaction = DefaultTonSigner.buildTx(tx);
    const { valid_until, network, ...restTransactionFields } = transaction;

    const result = await this.provider.sendTransaction({
      ...restTransactionFields,
      validUntil: valid_until,
      network: NETWORKS[network],
    });

    const hash = Cell.fromBase64(result.boc).hash().toString('hex');
    return { hash };
  }
}
