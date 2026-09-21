import type { ApproveAdapter, ApprovePrerequisite } from '../types';
import type { EvmTransaction } from 'rango-sdk';

import { utils } from '@hub3js/evm';
import { EVM_APPROVE_TYPE, TransactionType } from 'rango-types';

import { ensureEvmEnvironment } from '../../../environment/mod';

/** A receipt reporting a transaction that did not revert. */
const RECEIPT_STATUS_SUCCESS = 1;

export const evmApproveAdapter: ApproveAdapter<'evm', EvmTransaction> = {
  prerequisiteType: EVM_APPROVE_TYPE,
  namespaceKey: 'evm',
  signerTxType: TransactionType.EVM,
  // The allowance is read and the approve sent through the wallet, so it has to be on the chain.
  ensureEnvironment: ensureEvmEnvironment,

  // The approve calldata is encoded locally; the node is not needed to build it.
  buildApproveTransaction: async (prerequisite: ApprovePrerequisite) =>
    Promise.resolve({
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
    }),

  getTransactionStatus: async (namespace, hash) => {
    const receipt = await namespace.getTransactionReceipt(
      hash as `0x${string}`
    );
    if (!receipt) {
      return 'pending';
    }
    /*
     * The receipt status is a quantity, and wallets are not consistent about
     * how they hand it over: `0x1`, `0x01` and `1` all occur. Comparing it as
     * a number covers all of them.
     */
    return Number(receipt.status) === RECEIPT_STATUS_SUCCESS
      ? 'success'
      : 'failed';
  },
};
