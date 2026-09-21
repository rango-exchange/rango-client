import type { ActionContext } from '../../context';
import type { Failure, Transition } from '../../transitions';
import type { SwapExecution } from '../../types';
import type {
  TransactionPrerequisite,
  TransactionPrerequisiteResult,
} from 'rango-types';

import {
  EVM_APPROVE_TYPE,
  STELLAR_CHANGE_TRUSTLINE_TYPE,
  TRON_APPROVE_TYPE,
  XRPL_CHANGE_TRUSTLINE_TYPE,
} from 'rango-types';

import { ActionBlockedError, ActionError } from '../../../errors';
import { liftBlock } from '../../blocks';

import {
  executeEvmApprovePrerequisite,
  executeTronApprovePrerequisite,
} from './executeApprovePrerequisite/mod';
import { executeStellarChangeTrustLinePrerequisite } from './executeStellarChangeTrustlinePrerequisite/mod';
import { executeXrplChangeTrustLinePrerequisite } from './executeXrplChangeTrustlinePrerequisite/mod';

/**
 * Runs one prerequisite of a step one step further and reports the result.
 * The planner picks a prerequisite that has no result or a `pending` one; a
 * result that is already settled means the planner and the record disagree,
 * which fails the swap rather than doing the work twice.
 *
 * An empty list means nothing changed yet and the loop should ask again. A
 * wallet that is not ready to sign parks the step with a `blocked`
 * transition, and a step that was parked and gets through this time reports
 * `unblocked` first. A thrown error is a transport error for the loop to
 * retry; failures the swap has to stop on come back as a `failed` transition.
 */
export async function runPrerequisite(
  exec: SwapExecution,
  context: ActionContext,
  params: { stepIndex: number; prerequisiteIndex: number }
): Promise<Transition[]> {
  const { stepIndex, prerequisiteIndex } = params;
  const step = exec.steps[stepIndex];
  const prerequisite = step?.tx?.prerequisites[prerequisiteIndex];

  const fail = (code: Failure['code'], message: string): Transition[] => [
    {
      type: 'failed',
      failure: { code, phase: 'run_prerequisites', stepIndex, message },
    },
  ];

  if (!prerequisite) {
    return fail(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `Step ${stepIndex} has no prerequisite at index ${prerequisiteIndex}`
    );
  }

  const current = step.prerequisiteResults.find(
    (result) =>
      result.prerequisiteIndex === prerequisiteIndex &&
      result.prerequisiteType === prerequisite.type
  );
  if (current && current.status !== 'pending') {
    return fail(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `Prerequisite ${prerequisiteIndex} of step ${stepIndex} is already ${current.status}`
    );
  }

  let transitions: Transition[];
  try {
    const result = await execute(exec, context, {
      prerequisite,
      prerequisiteIndex,
      current,
    });
    transitions = result
      ? [{ type: 'prerequisite_updated', stepIndex, result }]
      : [];
  } catch (error) {
    if (error instanceof ActionBlockedError) {
      transitions = [{ type: 'blocked', stepIndex, block: error.block }];
    } else if (error instanceof ActionError) {
      transitions = fail(error.code, error.message);
    } else {
      throw error;
    }
  }

  return liftBlock(exec, stepIndex, transitions);
}

async function execute(
  exec: SwapExecution,
  context: ActionContext,
  params: {
    prerequisite: TransactionPrerequisite;
    prerequisiteIndex: number;
    current: TransactionPrerequisiteResult | undefined;
  }
): Promise<TransactionPrerequisiteResult | null> {
  const { prerequisite, prerequisiteIndex, current } = params;

  switch (prerequisite.type) {
    case XRPL_CHANGE_TRUSTLINE_TYPE:
      return executeXrplChangeTrustLinePrerequisite(
        exec,
        { prerequisite, prerequisiteIndex, current },
        context
      );
    case STELLAR_CHANGE_TRUSTLINE_TYPE:
      return executeStellarChangeTrustLinePrerequisite(
        exec,
        { prerequisite, prerequisiteIndex, current },
        context
      );
    case EVM_APPROVE_TYPE:
      return executeEvmApprovePrerequisite(
        exec,
        { prerequisite, prerequisiteIndex, current },
        context
      );
    case TRON_APPROVE_TYPE:
      return executeTronApprovePrerequisite(
        exec,
        { prerequisite, prerequisiteIndex, current },
        context
      );
    // The API can send a type newer than this SDK; asking again would never end.
    default: {
      const { type } = prerequisite as { type: string };
      throw new ActionError(
        'CLIENT_UNEXPECTED_BEHAVIOUR',
        `Prerequisite ${prerequisiteIndex} has unknown type ${type}`
      );
    }
  }
}
