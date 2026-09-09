import type {
  ApproveCapableNamespace,
  ApproveCapableNamespaceId,
  ApprovePrerequisite,
} from './types';
import type { SwapQueueContext } from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { WalletType } from '@hub3js/core';
import type { Result } from 'ts-results';

import { Err, Ok } from 'ts-results';

import { delay } from '../../helpers';

import {
  INTERVAL_BETWEEN_ALLOWANCE_CONFIRMATIONS,
  REQUIRED_ALLOWANCE_CONFIRMATIONS,
  TIMEOUT_FOR_ALLOWANCE_CONFIRMATIONS,
} from './constants';

/**
 * Resolves the wallet's hub namespace when it can execute approve prerequisites
 * (i.e. it exposes the `getAllowance` action). Wallets without it — those with no
 * hub namespace, or hardware wallets missing the action — run on the legacy
 * server-driven approval flow instead, so this returns `Err`.
 *
 * Keying `resolveApproveNamespace` by `K extends ApproveCapableNamespaceId` lets
 * `get(namespaceId)` return the concrete `ApproveCapableNamespace<K>`, so no cast
 * is needed.
 */
export function resolveApproveNamespace<K extends ApproveCapableNamespaceId>(
  context: SwapQueueContext,
  walletType: WalletType,
  namespaceId: K
): Result<ApproveCapableNamespace<K>, null> {
  try {
    // `hubProvider` throws for wallets that are not migrated to the hub.
    const namespace = context.hubProvider(walletType)?.get(namespaceId);
    if (namespace && 'getAllowance' in namespace) {
      return new Ok(namespace);
    }
    return new Err(null);
  } catch {
    return new Err(null);
  }
}

export async function isAllowanceSufficient<
  K extends ApproveCapableNamespaceId
>(
  prerequisite: ApprovePrerequisite,
  namespace: ApproveCapableNamespace<K>
): Promise<
  Result<{ allowanceIsSufficient: boolean }, NextTransactionStateError>
> {
  try {
    const allowance = await namespace.getAllowance({
      token: prerequisite.token,
      owner: prerequisite.wallet,
      spender: prerequisite.spender,
    });

    return new Ok({
      allowanceIsSufficient: BigInt(allowance) >= BigInt(prerequisite.amount),
    });
  } catch {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'Could not read the current allowance from the node.',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }
}

/**
 * Confirms the approval is in effect on chain before the swap is allowed to
 * run, by requiring `REQUIRED_ALLOWANCE_CONFIRMATIONS` reads in a row to report
 * a sufficient allowance. A mined approve transaction is not enough on its own:
 * the receipt and the allowance can be served by different nodes behind the
 * wallet's RPC, so one read agreeing with the receipt does not mean the node
 * the swap is submitted to has the approval yet.
 *
 * Reads that come back short are retried rather than believed, until waiting
 * can no longer explain them - an approval the user lowered in their wallet
 * stays short however long we look at it, and is reported once the time is up.
 */
export async function confirmAllowanceOnChain<
  K extends ApproveCapableNamespaceId
>(
  prerequisite: ApprovePrerequisite,
  namespace: ApproveCapableNamespace<K>
): Promise<
  Result<{ allowanceIsSufficient: boolean }, NextTransactionStateError>
> {
  const giveUpAt = Date.now() + TIMEOUT_FOR_ALLOWANCE_CONFIRMATIONS;
  let confirmations = 0;

  while (confirmations < REQUIRED_ALLOWANCE_CONFIRMATIONS) {
    const result = await isAllowanceSufficient(prerequisite, namespace);

    if (result.err) {
      return result;
    }

    // A short read discards the reads before it - they were not the same state.
    confirmations = result.val.allowanceIsSufficient ? confirmations + 1 : 0;

    if (confirmations >= REQUIRED_ALLOWANCE_CONFIRMATIONS) {
      break;
    }

    if (Date.now() >= giveUpAt) {
      return new Ok({ allowanceIsSufficient: false });
    }

    await delay(INTERVAL_BETWEEN_ALLOWANCE_CONFIRMATIONS);
  }

  return new Ok({ allowanceIsSufficient: true });
}
