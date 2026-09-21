import type { Failure, Transition } from '../transitions';
import type { SwapExecution } from '../types';
import type { RangoClient } from 'rango-sdk';

import { TransactionStatus } from 'rango-types';

/**
 * Asks the API what became of the step's sent transaction. It reports
 * `tracking` on every poll, followed by `step_succeeded` or `failed` once the
 * API is final, or by `tx_renewed` when the API replaced the transaction and
 * it has to be signed again.
 *
 * A request that fails is thrown for the loop to retry.
 */
export async function checkStatus(
  exec: SwapExecution,
  params: { stepIndex: number; httpClient: RangoClient }
): Promise<Transition[]> {
  const { stepIndex, httpClient } = params;
  const step = exec.steps[stepIndex];

  const fail = (
    code: Failure['code'],
    message?: string,
    origin?: Failure['origin']
  ): Transition[] => [
    {
      type: 'failed',
      failure: { code, phase: 'check_status', stepIndex, message, origin },
    },
  ];

  if (!step?.tx || !step.hash) {
    return fail(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `Step ${stepIndex} has no sent transaction to check`
    );
  }

  const response = await httpClient.checkStatus({
    requestId: exec.requestId,
    txId: step.hash,
    step: stepIndex + 1, // steps are 1-based in the API
  });

  const tracking: Transition = {
    type: 'tracking',
    stepIndex,
    outputAmount: response.outputAmount,
    internalSteps: response.steps,
    diagnosisUrl: response.diagnosisUrl,
    explorerUrls: response.explorerUrl,
    statusMessage: response.extraMessage,
  };

  if (response.newTx) {
    return [tracking, { type: 'tx_renewed', stepIndex, tx: response.newTx }];
  }

  if (response.status === TransactionStatus.SUCCESS) {
    return [
      tracking,
      {
        type: 'step_succeeded',
        stepIndex,
        outputAmount: response.outputAmount ?? step.outputAmount ?? '',
      },
    ];
  }
  if (response.status === TransactionStatus.FAILED) {
    return [
      tracking,
      ...fail(
        'TX_FAILED_IN_BLOCKCHAIN',
        response.extraMessage ?? undefined,
        'backend'
      ),
    ];
  }
  return [tracking];
}
