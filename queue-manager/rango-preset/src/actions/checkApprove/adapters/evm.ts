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

/** A receipt reporting a transaction that did not revert. */
const RECEIPT_STATUS_SUCCESS = 1;

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

  getTransactionStatus: async (
    namespace,
    executedTransactionHash
  ): Promise<ApproveTransactionStatus> => {
    const receipt = await namespace.getTransactionReceipt(
      executedTransactionHash as `0x${string}`
    );
    if (!receipt) {
      return 'pending';
    }
    /*
     * The receipt status is a quantity, and wallets are not consistent about
     * how they hand it over - `0x1`, `0x01` and `1` all occur - so it is
     * compared as a number rather than as the exact string the spec suggests.
     */
    return Number(receipt.status) === RECEIPT_STATUS_SUCCESS
      ? 'success'
      : 'failed';
  },
};
