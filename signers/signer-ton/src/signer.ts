import { GenericSigner, SignerError, TonTransaction } from 'rango-types';

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

    await this.provider.send({
      method: 'sendTransaction',
      params: [JSON.stringify(transactionObjectForSign)],
    });
    /*
      No hash is returned when signing a Ton transaction.
      Returns a string for API consistency 
    */
    return { hash: 'xxxxxxxx' };
  }
}
