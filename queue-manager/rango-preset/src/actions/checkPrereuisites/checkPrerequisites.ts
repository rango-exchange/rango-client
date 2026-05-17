import type { SwapQueueContext, SwapStorage } from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';

import { Networks } from '@rango-dev/wallets-shared';
import {
  STELLAR_CHANGE_TRUSTLINE_TYPE,
  type TransactionPrerequisite,
  XRPL_CHANGE_TRUSTLINE_TYPE,
} from 'rango-types';
import { Err } from 'ts-results';

import { getCurrentStep, getCurrentStepTx } from '../../helpers';
import { SwapActionTypes } from '../../types';
import { onNextStateError } from '../common/produceNextStateForTransaction';

import { checkIsPrerequisiteAlreadyMet } from './utils';

export async function checkPrerequisites(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const { failed, schedule, getStorage, next } = actions;

  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;
  const currentTransactionFromStorage = getCurrentStepTx(currentStep);

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

  const onAllPrerequisitesMet = () => {
    if (currentStep.fromBlockchain === Networks.XRPL) {
      schedule(SwapActionTypes.EXECUTE_XRPL_TRANSACTION);
    } else {
      schedule(SwapActionTypes.EXECUTE_TRANSACTION);
    }
    next();
    onFinish();
  };

  const scheduleSelectedPrerequisite = (
    prerequisite: TransactionPrerequisite
  ) => {
    switch (prerequisite.type) {
      case XRPL_CHANGE_TRUSTLINE_TYPE:
        schedule(SwapActionTypes.CHECK_XRPL_TRUSTLINE);
        next();
        onFinish();
        return;
      case STELLAR_CHANGE_TRUSTLINE_TYPE:
        handleErr(
          new Err({
            nextStatus: 'failed',
            nextStepStatus: 'failed',
            message:
              'Unexpected Error: Prerequisite STELLAR_CHANGE_TRUSTLINE is not supported!',
            details: undefined,
            errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
          })
        );
        return;
    }
  };
  if (!currentTransactionFromStorage?.prerequisites?.length) {
    // if no prerequisites, we can proceed to the next step
    onAllPrerequisitesMet();
    return;
  }

  const prerequisites = currentTransactionFromStorage.prerequisites;
  let allPrerequisitesMet = true;
  for (let index = 0; index < prerequisites.length; index++) {
    const prerequisite = prerequisites[index];
    const isPrerequisiteAlreadyMet = checkIsPrerequisiteAlreadyMet(
      { prerequisiteType: prerequisite.type, prerequisiteIndex: index },
      currentStep
    );

    if (!isPrerequisiteAlreadyMet) {
      scheduleSelectedPrerequisite(prerequisite);
      allPrerequisitesMet = false;
      return;
    }
  }

  if (allPrerequisitesMet) {
    onAllPrerequisitesMet();
  } else {
    throw new Error('Unhandled case. Not all prerequisites are met');
  }
}
