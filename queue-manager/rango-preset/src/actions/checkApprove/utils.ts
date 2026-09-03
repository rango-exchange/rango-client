import type {
  ApproveCapableNamespace,
  ApproveCapableNamespaceId,
  ApprovePrerequisite,
} from './types';
import type { SwapQueueContext } from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { Result } from 'ts-results';

import { Err, Ok } from 'ts-results';

/**
 * Whatever `hubProvider` accepts. Taken from the context rather than imported
 * from the wallet package directly, so this file does not depend on the legacy
 * module and keeps compiling when the wallet type moves.
 */
type WalletType = Parameters<SwapQueueContext['hubProvider']>[0];

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
