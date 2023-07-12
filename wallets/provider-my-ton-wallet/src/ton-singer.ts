import { GenericSigner, SignerError, TonTransaction } from 'rango-types';

export class TonSigner implements GenericSigner<TonTransaction> {
  constructor(private provider: any) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: TonTransaction): Promise<{ hash: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, blockChain, ...transactionObjectForSign } = tx;

    await this.provider.send({
      method: 'sendTransaction',
      params: [JSON.stringify(transactionObjectForSign)],
    });

    return { hash: 'xxxxxxxx' };
  }
}
