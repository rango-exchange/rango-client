import type { NextTransactionStateError } from '../../common/produceNextStateForTransaction';
import type {
  ApproveAdapter,
  ApprovePrerequisite,
  ApproveTransactionStatus,
} from '../types';
import type { TrxRawData } from 'rango-sdk';
import type { TronTransaction } from 'rango-types';
import type { Result } from 'ts-results';

import {
  isTronApprovePrerequisite,
  isTronApprovePrerequisiteResult,
  TransactionType,
  TRON_APPROVE_TYPE,
} from 'rango-types';
import { Err, Ok } from 'ts-results';

export const tronApproveAdapter: ApproveAdapter<'tron', TronTransaction> = {
  prerequisiteType: TRON_APPROVE_TYPE,
  namespaceKey: 'tron',
  signerTxType: TransactionType.TRON,

  isApprovePrerequisite: isTronApprovePrerequisite,

  isApprovePrerequisiteResult: isTronApprovePrerequisiteResult,

  /*
   * The Tron approve tx must be built via the node (through the namespace),
   * then normalized into a `TronTransaction` for the signer.
   */
  buildApproveTransaction: async (
    prerequisite: ApprovePrerequisite,
    namespace
  ): Promise<Result<TronTransaction, NextTransactionStateError>> => {
    try {
      const builtTransaction = await namespace.buildApproveTransaction({
        token: prerequisite.token,
        owner: prerequisite.wallet,
        spender: prerequisite.spender,
        amount: prerequisite.amount,
      });

      return Ok<TronTransaction>({
        type: TransactionType.TRON,
        blockChain: prerequisite.blockChain,
        prerequisites: [],
        isApprovalTx: true,
        raw_data: (builtTransaction.raw_data as TrxRawData) ?? null,
        raw_data_hex: builtTransaction.raw_data_hex ?? null,
        txID: builtTransaction.txID,
        visible: builtTransaction.visible ?? false,
        __payload__: {},
      });
    } catch {
      return new Err({
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message: 'Could not build the Tron approve transaction.',
        details: undefined,
        errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      });
    }
  },

  getTransactionStatus: async (
    namespace,
    executedTransactionHash
  ): Promise<ApproveTransactionStatus> => {
    const info = await namespace.getTransactionInfo(executedTransactionHash);
    /*
     * TronWeb returns an empty object until the transaction is confirmed in a
     * (solidified) block, so a missing `blockNumber` means it is still pending.
     * Once confirmed, Tron only sets `receipt.result` to a non-`SUCCESS` code on
     * failure and may omit it entirely on success — so a confirmed transaction
     * with no failure code is treated as success. (Requiring `result ===
     * 'SUCCESS'` left successful approves stuck on "waiting for approval".)
     */
    if (!info?.blockNumber) {
      return 'pending';
    }
    const result = info.receipt?.result;
    return !result || result === 'SUCCESS' ? 'success' : 'failed';
  },
};
