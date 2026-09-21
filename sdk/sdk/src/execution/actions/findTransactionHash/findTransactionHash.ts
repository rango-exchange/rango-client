import type { Failure, Transition } from '../../transitions';
import type { SwapExecution } from '../../types';

import { TransactionType } from 'rango-types';

import { ActionError } from '../../../errors';
import { lookupTransactionHash } from '../hyperliquid/mod';

/**
 * Looks up the hash of a transaction that was submitted without one, which
 * today means a Hyperliquid action: the exchange returns nothing, and the
 * wallet's history on the explorer lists the action by its nonce once it is
 * in. Found, the step reports `tx_sent` and is tracked like any other; not
 * found yet, an empty list so the loop asks again. An explorer that cannot
 * be reached is thrown for the loop to retry.
 */
export async function findTransactionHash(
  exec: SwapExecution,
  params: { stepIndex: number }
): Promise<Transition[]> {
  const { stepIndex } = params;
  const step = exec.steps[stepIndex];
  const tx = step?.tx;

  const fail = (code: Failure['code'], message: string): Transition[] => [
    {
      type: 'failed',
      failure: { code, phase: 'find_transaction_hash', stepIndex, message },
    },
  ];

  if (!tx || !step.submittedAt) {
    return fail(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `Step ${stepIndex} has no submitted transaction to look up`
    );
  }
  if (tx.type !== TransactionType.HYPERLIQUID) {
    return fail(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `${tx.type} transactions carry their hash when sent`
    );
  }

  const wallet = exec.wallets[tx.blockChain];
  if (!wallet) {
    return fail(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `The swap has no wallet for ${tx.blockChain}`
    );
  }

  try {
    const hash = await lookupTransactionHash(wallet.address, tx.nonce);

    return hash
      ? [{ type: 'tx_sent', stepIndex, hash, explorerUrl: null }]
      : [];
  } catch (error) {
    if (error instanceof ActionError) {
      return fail(error.code, error.message);
    }
    throw error;
  }
}
