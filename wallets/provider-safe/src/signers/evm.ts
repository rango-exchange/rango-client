import type { ProviderAPI } from '@hub3js/evm';
import type { OffChainSignMessageResponse } from '@safe-global/safe-apps-sdk';
import type { TransactionResponse } from 'ethers';
import type { GenericSigner } from 'rango-types';
import type { EvmTransaction } from 'rango-types/mainApi';

import { DefaultEvmSigner, waitMs } from '@rango-dev/signer-evm';
import { TransactionStatus } from '@safe-global/safe-apps-sdk';

import { sdk } from '../safe.ts';

type SafeTransactionResponse = Partial<TransactionResponse> & {
  hashRequiringUpdate: boolean;
};

export async function getTxHash(safeHash: string): Promise<{ txHash: string }> {
  let txHash;
  const timeout = 5_000;

  while (!txHash) {
    try {
      /** The SDK will be pinged until a txHash is available and the txStatus is in an end-state */
      const queued = await sdk.txs.getBySafeTxHash(safeHash);
      if (
        queued.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS ||
        queued.txStatus === TransactionStatus.AWAITING_EXECUTION
      ) {
        /** Mimic a status watcher by checking once every 5 seconds */
        await waitMs(timeout);
      } else if (queued.txHash) {
        /** The txStatus is in an end-state (e.g. success) so we probably have a valid, on chain txHash*/
        txHash = queued.txHash;
      }
    } catch {
      txHash = safeHash;
    }
  }
  return { txHash };
}

export class CustomEvmSigner implements GenericSigner<EvmTransaction> {
  private signer;

  constructor(provider: ProviderAPI) {
    this.signer = new DefaultEvmSigner(provider);
  }

  async signMessage(msg: string): Promise<string> {
    const { signature } = (await sdk.txs.signMessage(
      msg
    )) as OffChainSignMessageResponse & { signature: string };

    return signature;
  }

  async signAndSendTx(
    tx: EvmTransaction,
    address: string,
    chainId: string | null
  ): Promise<{ hash: string; response: SafeTransactionResponse }> {
    const { hash, response } = await this.signer.signAndSendTx(
      tx,
      address,
      chainId
    );
    return {
      hash,
      response: { ...response, hashRequiringUpdate: true },
    };
  }

  async wait(
    safeHash: string,
    chainId: string,
    response: SafeTransactionResponse
  ): Promise<{
    hash: string;
    response: SafeTransactionResponse;
    chainId: string;
  }> {
    /*
     * `wait` is called on every status poll. On the first poll `safeHash` is the
     * safeTxHash, which `getTxHash` maps to the on-chain hash; the queue then
     * updates `executedTransactionId` to that on-chain hash. From the next poll
     * onwards `wait` receives the on-chain hash, and querying the Safe gateway
     * with it 404s (the gateway resolves by safeTxHash, not the on-chain hash),
     * which makes Safe{Wallet} log a harmless `Code 901`. Once the hash no longer
     * requires updating we already have the final hash, so skip the lookup.
     */
    if (response && !response.hashRequiringUpdate) {
      return { hash: safeHash, response, chainId };
    }

    const { txHash: hash } = await getTxHash(safeHash);
    return {
      hash,
      response: { ...response, hashRequiringUpdate: false },
      chainId,
    };
  }
}
