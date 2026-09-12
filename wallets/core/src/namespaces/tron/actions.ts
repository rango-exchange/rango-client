import type { ProviderAPI, TronActions } from './types.js';
import type { Context } from '../../hub/namespaces/mod.js';
import type { FunctionWithContext } from '../../types/actions.js';

import { recommended as commonRecommended } from '../common/actions.js';

import {
  APPROVE_FUNCTION_SELECTOR,
  DEFAULT_APPROVE_FEE_LIMIT,
} from './constants.js';
import {
  buildApprovePayload,
  getTronWeb,
  hexAddressToTronBase58,
} from './utils.js';

export const recommended = [...commonRecommended];

/**
 * Reads a TRC-20 `allowance(owner, spender)` via a constant contract call and
 * returns it as a decimal string.
 */
export function getAllowance(
  instance: () => ProviderAPI | undefined
): FunctionWithContext<TronActions['getAllowance'], Context> {
  return async (_context, params) => {
    const tronWeb = getTronWeb(instance);
    const owner = hexAddressToTronBase58(tronWeb, params.owner);
    const token = hexAddressToTronBase58(tronWeb, params.token);
    const spender = hexAddressToTronBase58(tronWeb, params.spender);

    const { result, constant_result } =
      await tronWeb.transactionBuilder.triggerConstantContract(
        token,
        'allowance(address,address)',
        {},
        [
          { type: 'address', value: owner },
          { type: 'address', value: spender },
        ],
        owner
      );

    if (!result?.result || !constant_result?.length) {
      throw new Error('Failed to read the TRC-20 allowance.');
    }

    return BigInt(`0x${constant_result[0]}`).toString();
  };
}

/**
 * Builds (via the node) a ready-to-sign `approve(spender, amount)` transaction
 * on the TRC-20 token contract.
 *
 * The transaction carries TronWeb's default 60s expiration, which is the same
 * window server-built approvals use.
 */
export function buildApproveTransaction(
  instance: () => ProviderAPI | undefined
): FunctionWithContext<TronActions['buildApproveTransaction'], Context> {
  return async (_context, params) => {
    const tronWeb = getTronWeb(instance);
    const owner = hexAddressToTronBase58(tronWeb, params.owner);
    const token = hexAddressToTronBase58(tronWeb, params.token);
    const spender = hexAddressToTronBase58(tronWeb, params.spender);

    const feeLimit = params.feeLimit ?? DEFAULT_APPROVE_FEE_LIMIT;
    const { result, transaction } =
      await tronWeb.transactionBuilder.triggerSmartContract(
        token,
        APPROVE_FUNCTION_SELECTOR,
        { feeLimit },
        [
          { type: 'address', value: spender },
          { type: 'uint256', value: params.amount },
        ],
        owner
      );

    if (!result?.result) {
      throw new Error('Failed to build the TRC-20 approve transaction.');
    }

    /*
     * `transactionBuilder` returns only the consensus fields. A server-built
     * transaction also carries `__payload__`, which wallets use to re-issue the
     * call when the user edits the allowance, so add it here too.
     */
    return {
      ...transaction,
      __payload__: buildApprovePayload(transaction, feeLimit),
    };
  };
}

/** Reads a transaction's on-chain info (empty while the tx is unconfirmed). */
export function getTransactionInfo(
  instance: () => ProviderAPI | undefined
): FunctionWithContext<TronActions['getTransactionInfo'], Context> {
  return async (_context, txID) => {
    const tronWeb = getTronWeb(instance);
    // Full node (not solidity), so the info is available right after inclusion.
    return tronWeb.trx.getUnconfirmedTransactionInfo(txID);
  };
}
