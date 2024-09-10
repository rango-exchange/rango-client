import type { CosmosTransaction, GenericSigner } from 'rango-types';

import { executeCosmosTransaction } from '@rango-dev/signer-cosmos';
import { getNetworkInstance, Networks } from '@rango-dev/wallets-shared';
import { SignerError, SignerErrorCode } from 'rango-types';

import { xdefiTransfer } from './helpers.js';

/*
 * TODO - replace with real type
 * tslint:disable-next-line: no-any
 */
type CosmosExternalProvider = any;

export class CustomCosmosSigner implements GenericSigner<CosmosTransaction> {
  private provider: CosmosExternalProvider;
  constructor(provider: CosmosExternalProvider) {
    this.provider = provider;
  }

  async signMessage(
    msg: string,
    address: string,
    chainId: string | null
  ): Promise<string> {
    try {
      if (!chainId) {
        throw Error('ChainId is required');
      }
      const { signature } = await this.provider.signArbitrary(
        chainId,
        address,
        msg
      );
      return signature;
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }
  async signAndSendTx(tx: CosmosTransaction): Promise<{ hash: string }> {
    if (tx.rawTransfer === null) {
      const cosmosProvider = getNetworkInstance(this.provider, Networks.COSMOS);
      const hash = await executeCosmosTransaction(tx, cosmosProvider);
      return { hash };
    }

    const binanceProvider = getNetworkInstance(this.provider, Networks.BINANCE);

    const from = tx.fromWalletAddress;
    const { method, memo, recipient, decimals, amount, asset } = tx.rawTransfer;
    const blockchain = tx.blockChain;
    const hash = await xdefiTransfer(
      blockchain,
      asset.ticker,
      from,
      amount,
      decimals,
      recipient,
      binanceProvider,
      method,
      memo
    );
    return { hash };
  }
}
