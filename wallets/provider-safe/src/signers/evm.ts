import type { OffChainSignMessageResponse } from '@safe-global/safe-apps-sdk';
import type { TransactionResponse } from 'ethers';
import type { GenericSigner } from 'rango-types';
import type { EvmTransaction } from 'rango-types/mainApi';

import { DefaultEvmSigner, waitMs } from '@arlert-dev/signer-evm';
import { TransactionStatus } from '@safe-global/safe-apps-sdk';

import { sdk } from '../helpers.js';

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

  constructor(provider: any) {
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
  ): Promise<{
    hash: string;
    response: Partial<TransactionResponse> & { hashRequiringUpdate: boolean };
  }> {
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
    response: TransactionResponse
  ): Promise<{
    hash: string;
    response: TransactionResponse;
    chainId: string;
  }> {
    const { txHash: hash } = await getTxHash(safeHash);
    return {
      hash,
      response,
      chainId,
    };
  }
}
