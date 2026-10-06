import type {
  ApproveAdapter,
  ApprovePrerequisite,
  ApproveTransactionStatus,
} from '../types';
import type { EvmTransaction } from 'rango-sdk';

import { utils } from '@hub3js/evm';
import {
  EVM_APPROVE_TYPE,
  isEvmApprovePrerequisite,
  isEvmApprovePrerequisiteResult,
  TransactionType,
} from 'rango-types';
import { Ok } from 'ts-results';

import { sendEvmTransaction } from '../../common/evm';

/**
 * viem throws this while the transaction is pending. It is matched by name so
 * queue-manager doesn't depend on viem.
 */
const RECEIPT_NOT_FOUND_ERROR_NAME = 'TransactionReceiptNotFoundError';

function isReceiptNotFoundError(error: unknown): boolean {
  let current: unknown = error;
  while (current instanceof Error) {
    if (current.name === RECEIPT_NOT_FOUND_ERROR_NAME) {
      return true;
    }
    current = current.cause;
  }
  return false;
}

export const evmApproveAdapter: ApproveAdapter<'evm', EvmTransaction> = {
  prerequisiteType: EVM_APPROVE_TYPE,
  namespaceKey: 'evm',
  signerTxType: TransactionType.EVM,

  isApprovePrerequisite: isEvmApprovePrerequisite,

  isApprovePrerequisiteResult: isEvmApprovePrerequisiteResult,

  // EVM approve calldata is encoded client-side; no node round-trip needed.
  buildApproveTransaction: async (prerequisite: ApprovePrerequisite) =>
    Promise.resolve(
      Ok<EvmTransaction>({
        type: TransactionType.EVM,
        blockChain: prerequisite.blockChain,
        prerequisites: [],
        isApprovalTx: true,
        from: prerequisite.wallet,
        to: prerequisite.token,
        data: utils.encodeApproveCallData(
          prerequisite.spender,
          prerequisite.amount
        ),
        value: null,
        nonce: null,
        gasLimit: null,
        gasPrice: null,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
      })
    ),

  sendTransaction: sendEvmTransaction,

  getTransactionStatus: async (
    namespace,
    executedTransactionHash
  ): Promise<ApproveTransactionStatus> => {
    try {
      const receipt = await namespace.getTransactionReceipt({
        hash: executedTransactionHash as `0x${string}`,
      });
      return receipt.status === 'success' ? 'success' : 'failed';
    } catch (error) {
      if (isReceiptNotFoundError(error)) {
        return 'pending';
      }
      throw error;
    }
  },
};
