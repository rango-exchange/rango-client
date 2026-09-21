import type { ApproveAdapter, ApprovePrerequisite } from '../types';
import type { TronTransaction, TrxRawData } from 'rango-sdk';

import { TransactionType, TRON_APPROVE_TYPE } from 'rango-types';

import { ActionError } from '../../../../../errors';
import { ensureWalletConnected } from '../../../environment/mod';

export const tronApproveAdapter: ApproveAdapter<'tron', TronTransaction> = {
  prerequisiteType: TRON_APPROVE_TYPE,
  namespaceKey: 'tron',
  signerTxType: TransactionType.TRON,
  // Tron has one network, so a connected wallet with the right account is all it takes.
  ensureEnvironment: async (exec, context, blockChain) =>
    ensureWalletConnected(exec, context, { blockChain, namespaceKey: 'tron' }),

  // The node builds the Tron approve; it is then shaped into what the signer takes.
  buildApproveTransaction: async (
    prerequisite: ApprovePrerequisite,
    namespace
  ) => {
    let built: Awaited<ReturnType<typeof namespace.buildApproveTransaction>>;
    try {
      built = await namespace.buildApproveTransaction({
        token: prerequisite.token,
        owner: prerequisite.wallet,
        spender: prerequisite.spender,
        amount: prerequisite.amount,
      });
    } catch (error) {
      throw new ActionError(
        'CLIENT_UNEXPECTED_BEHAVIOUR',
        'Could not build the Tron approve transaction',
        error
      );
    }

    return {
      type: TransactionType.TRON,
      blockChain: prerequisite.blockChain,
      prerequisites: [],
      isApprovalTx: true,
      raw_data: (built.raw_data as TrxRawData) ?? null,
      raw_data_hex: built.raw_data_hex ?? null,
      txID: built.txID,
      visible: built.visible ?? false,
      /*
       * Describes the contract call, so a wallet that lets the user edit the
       * allowance can re-issue it. Without it TronLink refuses to sign.
       */
      __payload__: built.__payload__ ?? {},
    };
  },

  getTransactionStatus: async (namespace, hash) => {
    const info = await namespace.getTransactionInfo(hash);
    /*
     * The info stays empty until the transaction is in a block, so a missing
     * block number means it is still pending. Once included, Tron only sets
     * `receipt.result` to a non-`SUCCESS` code on failure and may leave it out
     * on success, so an included transaction with no failure code succeeded.
     */
    if (!info?.blockNumber) {
      return 'pending';
    }
    const result = info.receipt?.result;
    return !result || result === 'SUCCESS' ? 'success' : 'failed';
  },
};
