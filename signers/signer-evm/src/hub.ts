import type { ProxiedNamespace } from '@rango-dev/wallets-core';
import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';
import type { EvmTransaction } from 'rango-types/mainApi';

import {
  isError,
  type TransactionRequest,
  type TransactionResponse,
} from 'ethers';
import { BrowserProvider } from 'ethers';
import {
  type GenericSigner,
  RPCErrorCode as RangoRPCErrorCode,
  SignerError,
  SignerErrorCode,
} from 'rango-types';

import { cleanEvmError, getTenderlyError, waitMs } from './helper.js';

const waitWithMempoolCheck = async (
  namespace: ProxiedNamespace<EvmActions>,
  tx: TransactionResponse,
  txHash: string,
  confirmations?: number
) => {
  const TIMEOUT = 3_000;
  let finished = false;
  return await Promise.race([
    (async () => {
      await tx.wait(confirmations);
      finished = true;
    })(),
    (async () => {
      while (!finished) {
        await waitMs(TIMEOUT);
        if (finished) {
          return null;
        }
        try {
          const mempoolTx = await namespace.getTransaction(txHash);
          if (!mempoolTx) {
            return null;
          }
        } catch (error) {
          console.log({ error });
          return null;
        }
      }
      return null;
    })(),
  ]);
};

const checkChainIdChanged = async (
  namespace: ProxiedNamespace<EvmActions>,
  chainId: string
) => {
  const evmInstance = namespace.getInstance();
  if (!evmInstance) {
    return true;
  }
  const provider = new BrowserProvider(evmInstance);
  const signerChainId = (await provider.getNetwork()).chainId;
  if (
    !signerChainId ||
    Number(chainId).toString() !== signerChainId.toString()
  ) {
    return true;
  }

  return false;
};

export class HubEvmSigner implements GenericSigner<EvmTransaction> {
  private namespace: ProxiedNamespace<EvmActions>;

  constructor(namespace: ProxiedNamespace<EvmActions>) {
    this.namespace = namespace;
  }

  static buildTx(evmTx: EvmTransaction, disableV2 = false): TransactionRequest {
    const TO_STRING_BASE = 16;
    let tx: TransactionRequest = {};
    /*
     * it's better to pass 0x instead of undefined, otherwise some wallets could face issue
     * https://github.com/WalletConnect/web3modal/issues/1082#issuecomment-1637793242
     */
    tx = {
      data: evmTx.data || '0x',
    };
    if (evmTx.from) {
      tx = { ...tx, from: evmTx.from };
    }
    if (evmTx.to) {
      tx = { ...tx, to: evmTx.to };
    }
    if (evmTx.value) {
      tx = { ...tx, value: evmTx.value };
    }
    if (evmTx.nonce) {
      tx = { ...tx, nonce: parseInt(evmTx.nonce) };
    }
    if (evmTx.gasLimit) {
      tx = { ...tx, gasLimit: evmTx.gasLimit };
    }
    if (!disableV2 && evmTx.maxFeePerGas && evmTx.maxPriorityFeePerGas) {
      tx = {
        ...tx,
        maxFeePerGas: evmTx.maxFeePerGas,
        maxPriorityFeePerGas: evmTx.maxPriorityFeePerGas,
      };
    } else if (evmTx.gasPrice) {
      tx = {
        ...tx,
        gasPrice: '0x' + parseInt(evmTx.gasPrice).toString(TO_STRING_BASE),
      };
    }
    return tx;
  }

  async signMessage(msg: string): Promise<string> {
    try {
      return this.namespace.signMessage(msg);
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(
    tx: EvmTransaction,
    address: string,
    chainId: string | null
  ): Promise<{ hash: string; response: TransactionResponse }> {
    try {
      try {
        const transaction = HubEvmSigner.buildTx(tx);
        const response = await this.namespace.sendTransaction(
          transaction,
          address,
          chainId
        );
        return { hash: response.hash, response };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // retrying EIP-1559 without v2 related fields
        if (
          !!error?.message &&
          typeof error.message === 'string' &&
          error.message.indexOf('EIP-1559') !== -1
        ) {
          console.log('retrying EIP-1559 error without v2 fields ...');
          const transaction = HubEvmSigner.buildTx(tx, true);
          const response = await this.namespace.sendTransaction(
            transaction,
            address,
            chainId
          );
          return { hash: response.hash, response };
        }
        throw error;
      }
    } catch (error) {
      throw cleanEvmError(error);
    }
  }

  async wait(
    txHash: string,
    chainId?: string,
    txResponse?: TransactionResponse,
    confirmations?: number
  ): Promise<{ hash: string; response?: TransactionResponse }> {
    try {
      /*
       * if we have transaction response, use that to wait
       * otherwise, try to get tx response from the wallet provider
       */
      if (txResponse) {
        // if we use waitWithMempoolCheck here, we can't detect replaced tx anymore
        await txResponse?.wait(confirmations);
        return { hash: txHash };
      }

      // ignore wait if namespace is not connected yet
      if (!this.namespace.state()[0]?.()?.connected) {
        return { hash: txHash };
      }

      // ignore wait if namespace does not support getTransaction
      if (!('getTransaction' in this.namespace)) {
        return { hash: txHash };
      }

      /*
       * don't proceed if signer chain changed or chain id is not specified
       * because if user change the wallet network, we receive null on getTransaction
       */
      if (!chainId) {
        return { hash: txHash };
      }

      const hasChainIdChanged = await checkChainIdChanged(
        this.namespace,
        chainId
      );
      if (hasChainIdChanged) {
        return { hash: txHash };
      }

      const tx = await this.namespace.getTransaction(txHash);
      if (!tx) {
        throw Error(`Transaction hash '${txHash}' not found in blockchain.`);
      }

      await waitWithMempoolCheck(this.namespace, tx, txHash, confirmations);
      return { hash: txHash };
    } catch (error) {
      if (isError(error, 'TRANSACTION_REPLACED')) {
        const reason = error.reason;
        if (reason === 'cancelled') {
          throw new SignerError(
            SignerErrorCode.SEND_TX_ERROR,
            undefined,
            'Transaction replaced and canceled by user',
            undefined,
            error
          );
        }
        return { hash: error.replacement.hash, response: error.replacement };
      } else if (isError(error, 'CALL_EXCEPTION')) {
        const tError = await getTenderlyError(chainId, txHash);
        if (!!tError) {
          throw new SignerError(
            SignerErrorCode.TX_FAILED_IN_BLOCKCHAIN,
            'Trannsaction failed in blockchain',
            tError,
            RangoRPCErrorCode.CALL_EXCEPTION,
            error
          );
        } else {
          /**
           * In cases where the is no error returen from tenderly, we could ignore
           * the error and proceed with check status flow.
           */
          return { hash: txHash };
        }
      }
      /**
       * Ignore other errors in confirming transaction and proceed with check status flow,
       * Some times rpc gives internal error or other type of errors even if the transaction succeeded
       */
      return { hash: txHash };
    }
  }
}
