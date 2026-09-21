import type {
  ApproveNamespace,
  ApproveNamespaceKey,
  ApprovePrerequisite,
} from './types';
import type { Provider } from '@hub3js/core';
import type { DefaultNamespaces } from '@hub3js/namespaces';

import { ActionError } from '../../../../errors';

import {
  INTERVAL_BETWEEN_ALLOWANCE_CONFIRMATIONS,
  REQUIRED_ALLOWANCE_CONFIRMATIONS,
  TIMEOUT_FOR_ALLOWANCE_CONFIRMATIONS,
} from './constants';

/**
 * The wallet's namespace for the chain, which has to have registered the
 * `getAllowance` action: the allowance is read through it, and nobody else
 * approves on the swap's behalf. A wallet without it cannot run the swap, so
 * that is a client error rather than something to skip.
 */
export function resolveApproveNamespace<K extends ApproveNamespaceKey>(
  provider: Provider<DefaultNamespaces>,
  namespaceKey: K
): ApproveNamespace<K> {
  const namespace = provider.get(namespaceKey);
  // `in` goes through the namespace proxy, so it is true only when the action is registered.
  if (!namespace || !('getAllowance' in namespace)) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `Wallet ${provider.id} cannot read allowances on its ${namespaceKey} namespace`
    );
  }
  return namespace;
}

export async function isAllowanceSufficient<K extends ApproveNamespaceKey>(
  prerequisite: ApprovePrerequisite,
  namespace: ApproveNamespace<K>
): Promise<boolean> {
  let allowance: string;
  try {
    allowance = await namespace.getAllowance({
      token: prerequisite.token,
      owner: prerequisite.wallet,
      spender: prerequisite.spender,
    });
  } catch (error) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      'Could not read the allowance from the node',
      error
    );
  }

  return BigInt(allowance) >= BigInt(prerequisite.amount);
}

/**
 * Confirms the approval is in effect on chain before the swap runs, by
 * requiring `REQUIRED_ALLOWANCE_CONFIRMATIONS` reads in a row to report a
 * sufficient allowance. A mined approve transaction is not enough on its own:
 * the receipt and the allowance can be served by different nodes behind the
 * wallet's RPC, so the node the swap goes to may not have the approval yet.
 *
 * A short read discards the reads before it and is retried until the timeout,
 * after which the shortfall is reported as real.
 */
export async function confirmAllowanceOnChain<K extends ApproveNamespaceKey>(
  prerequisite: ApprovePrerequisite,
  namespace: ApproveNamespace<K>
): Promise<boolean> {
  const giveUpAt = Date.now() + TIMEOUT_FOR_ALLOWANCE_CONFIRMATIONS;
  let confirmations = 0;

  while (confirmations < REQUIRED_ALLOWANCE_CONFIRMATIONS) {
    const sufficient = await isAllowanceSufficient(prerequisite, namespace);
    confirmations = sufficient ? confirmations + 1 : 0;

    if (confirmations >= REQUIRED_ALLOWANCE_CONFIRMATIONS) {
      break;
    }
    if (Date.now() >= giveUpAt) {
      return false;
    }
    await delay(INTERVAL_BETWEEN_ALLOWANCE_CONFIRMATIONS);
  }

  return true;
}

async function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
