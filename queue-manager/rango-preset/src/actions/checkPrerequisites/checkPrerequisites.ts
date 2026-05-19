import type { SwapQueueContext, SwapStorage } from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';
import type { Result } from 'ts-results';

import { Networks } from '@rango-dev/wallets-shared';
import {
  STELLAR_CHANGE_TRUSTLINE_TYPE,
  XRPL_CHANGE_TRUSTLINE_TYPE,
} from 'rango-types';
import { Err, Ok } from 'ts-results';

import { getCurrentStep, getCurrentStepTx } from '../../helpers';
import { SwapActionTypes } from '../../types';
import { onNextStateError } from '../common/produceNextStateForTransaction';

import {
  checkIsPrerequisiteAlreadyMet,
  handleUnmetStellarChangeTrustLinePrerequisite,
  handleUnmetXrplChangeTrustLinePrerequisite,
} from './utils';

export async function checkPrerequisites(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const { failed, schedule, getStorage, next } = actions;

  const onFinish = () => {
    if (actions.context.resetClaimedBy) {
      actions.context.resetClaimedBy();
    }
  };

  const handleErr = (err: Err<NextTransactionStateError>) => {
    onNextStateError(actions, err.val);
    failed();
    onFinish();
  };

  const scheduleAction = (action: SwapActionTypes) => {
    schedule(action);
    next();
    onFinish();
  };

  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;
  const currentTransactionFromStorage = getCurrentStepTx(currentStep);

  if (!currentTransactionFromStorage) {
    handleErr(
      new Err({
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message: 'Unexpected Error: tx is null!',
        details: undefined,
        errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      })
    );
    return;
  }

  const prerequisites = currentTransactionFromStorage.prerequisites;

  const unmetPrerequisiteIndex = prerequisites.findIndex(
    (prerequisite, prerequisiteIndex) =>
      !checkIsPrerequisiteAlreadyMet(
        { prerequisiteType: prerequisite.type, prerequisiteIndex },
        currentStep
      )
  );

  let result: Result<SwapActionTypes, string> | null = null;
  if (unmetPrerequisiteIndex !== -1) {
    switch (prerequisites[unmetPrerequisiteIndex].type) {
      case XRPL_CHANGE_TRUSTLINE_TYPE:
        result = handleUnmetXrplChangeTrustLinePrerequisite(
          unmetPrerequisiteIndex,
          currentStep
        );
        break;
      case STELLAR_CHANGE_TRUSTLINE_TYPE:
        result = handleUnmetStellarChangeTrustLinePrerequisite(
          unmetPrerequisiteIndex,
          currentStep
        );
        break;
      default:
        result = new Err('Unexpected Error: unknown prerequisite type!');
        break;
    }
  } else {
    if (currentStep.fromBlockchain === Networks.XRPL) {
      result = new Ok(SwapActionTypes.EXECUTE_XRPL_TRANSACTION);
    } else {
      result = new Ok(SwapActionTypes.EXECUTE_TRANSACTION);
    }
  }

  if (result?.err) {
    handleErr(
      new Err({
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message: result.val,
        details: undefined,
        errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      })
    );
  } else {
    scheduleAction(result.val);
  }
}
