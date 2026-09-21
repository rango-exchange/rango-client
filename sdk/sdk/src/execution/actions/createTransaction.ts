import type { Transition } from '../transitions';
import type { SwapExecution } from '../types';
import type { CreateTransactionRequest, RangoClient } from 'rango-sdk';

import { errorMessage } from '../../errors';

export async function createTransaction(
  exec: SwapExecution,
  params: { stepIndex: number; httpClient: RangoClient }
): Promise<Transition[]> {
  const { stepIndex, httpClient } = params;

  const request: CreateTransactionRequest = {
    requestId: exec.requestId,
    step: stepIndex + 1, // step starts from 1 in Rango services
    userSettings: {
      slippage: exec.settings.slippage,
      infiniteApprove: exec.settings.infiniteApprove,
    },
    validations: {
      balance: exec.validateBalanceOrFee,
      fee: exec.validateBalanceOrFee,
      // Approvals are the engine's job: the API lists them as prerequisites and the wallet reads the allowance.
      approve: false,
    },
  };

  try {
    const response = await httpClient.createTransaction(request);
    // The endpoint reports failure in the body, not the status code.
    if (!response.ok || !response.transaction) {
      throw new Error('FETCH_TX_FAILED');
    }
    return [{ type: 'tx_built', stepIndex, tx: response.transaction }];
  } catch (error) {
    return [
      {
        type: 'failed',
        failure: {
          code: 'FETCH_TX_FAILED',
          phase: 'create_transaction',
          stepIndex,
          message: errorMessage(error),
        },
      },
    ];
  }
}
