import type { ExecuteHooks, SendResult } from './types';
import type { ActionContext } from '../../context';
import type { Failure, Transition } from '../../transitions';
import type { SwapExecution } from '../../types';
import type { Transaction } from 'rango-sdk';

import { TransactionType } from 'rango-types';

import { ActionBlockedError, ActionError } from '../../../errors';

import { executeEvmTransaction } from './executeEvmTransaction';
import { executeGenericTransaction } from './executeGenericTransaction';
import { executeHyperliquidTransaction } from './executeHyperliquidTransaction';

/**
 * Hands the step's transaction to the wallet and reports what came of it:
 * `tx_sent` with the hash, or `tx_submitted` when the transaction is out but
 * its hash has to be looked up afterwards. The transaction type picks the
 * executor: each one first checks the wallet is in a state to sign, then asks
 * it to.
 *
 * A wallet that is not ready parks the step with a `blocked` transition. A
 * wallet rejection fails the swap with the signer's own code; any other
 * wallet error with `CALL_OR_SEND_FAILED`. A step that was parked and gets
 * through this time is unparked by the engine in `beforeSign`, which the
 * executor calls once the guard has passed.
 */
export async function executeTransaction(
  exec: SwapExecution,
  context: ActionContext,
  params: { stepIndex: number } & ExecuteHooks
): Promise<Transition[]> {
  const { stepIndex, beforeSign } = params;
  const tx = exec.steps[stepIndex]?.tx;

  const fail = (code: Failure['code'], message: string): Transition[] => [
    {
      type: 'failed',
      failure: { code, phase: 'execute_transaction', stepIndex, message },
    },
  ];

  if (!tx) {
    return fail(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `Step ${stepIndex} has no transaction to execute`
    );
  }

  try {
    const { hash } = await execute(exec, context, tx, { beforeSign });

    if (hash === null) {
      return [{ type: 'tx_submitted', stepIndex }];
    }
    return [{ type: 'tx_sent', stepIndex, hash, explorerUrl: null }];
  } catch (error) {
    if (error instanceof ActionBlockedError) {
      return [{ type: 'blocked', stepIndex, block: error.block }];
    }
    if (error instanceof ActionError) {
      return fail(error.code, error.message);
    }
    throw error;
  }
}

async function execute(
  exec: SwapExecution,
  context: ActionContext,
  tx: Transaction,
  hooks: ExecuteHooks
): Promise<SendResult> {
  if (tx.type === TransactionType.EVM) {
    return executeEvmTransaction(exec, context, tx, hooks);
  }
  if (tx.type === TransactionType.HYPERLIQUID) {
    return executeHyperliquidTransaction(exec, context, tx, hooks);
  }
  return executeGenericTransaction(exec, context, tx, hooks);
}
