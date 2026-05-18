import type { Result } from 'ts-results';

import {
  type PendingSwapStep,
  type SwapStepStatus,
  type TransactionPrerequisiteType,
  XRPL_CHANGE_TRUSTLINE_TYPE,
} from 'rango-types';
import { Err, Ok } from 'ts-results';

import { SwapActionTypes } from '../../types';

export const checkIsPrerequisiteAlreadyMet = (
  prerequisiteInfo: {
    prerequisiteType: TransactionPrerequisiteType;
    prerequisiteIndex: number;
  },
  step: PendingSwapStep
): boolean => {
  const prerequisiteResult = getPrerequisiteResult(step, prerequisiteInfo);
  if (
    prerequisiteResult?.status === 'success' ||
    prerequisiteResult?.status === 'skipped'
  ) {
    return true;
  }
  return false;
};

export function getPrerequisiteResult(
  step: PendingSwapStep,
  key: {
    prerequisiteType: TransactionPrerequisiteType;
    prerequisiteIndex: number;
  }
): SwapStepStatus['prerequisiteResults'][number] | undefined {
  return step.prerequisiteResults?.find((r) => matchesPrerequisiteKey(r, key));
}

export const matchesPrerequisiteKey = (
  a: {
    prerequisiteIndex: number;
    prerequisiteType: TransactionPrerequisiteType;
  },
  b: {
    prerequisiteIndex: number;
    prerequisiteType: TransactionPrerequisiteType;
  }
) =>
  a.prerequisiteIndex === b.prerequisiteIndex &&
  a.prerequisiteType === b.prerequisiteType;

export function handleUnmetXrplChangeTrustLinePrerequisite(
  prerequisiteIndex: number,
  currentStep: PendingSwapStep
): Result<SwapActionTypes, string> {
  const prerequisiteResult = getPrerequisiteResult(currentStep, {
    prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
    prerequisiteIndex,
  });

  if (!prerequisiteResult) {
    return new Ok(SwapActionTypes.CHECK_XRPL_TRUSTLINE);
  }

  switch (prerequisiteResult.status) {
    case 'pending':
      return new Ok(SwapActionTypes.CHECK_XRPL_TRUSTLINE_TRANSACTION_STATUS);
    case 'success': // Unreachable code
      return new Err(
        'Unexpected Error: xrpl change trustline prerequisite is already met!'
      );
    case 'skipped': // Unreachable code
      return new Err(
        'Unexpected Error: xrpl change trustline prerequisite is already met!'
      );
    case 'failed':
      return new Err(
        'Unexpected Error: xrpl change trustline prerequisite failed!'
      );
    default:
      return new Err(
        'Unexpected Error: xrpl change trustline prerequisite has an invalid status!'
      );
  }
}
