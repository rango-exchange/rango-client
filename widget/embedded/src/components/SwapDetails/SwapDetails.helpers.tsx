import type { GetStep } from '../SwapDetailsAlerts';
import type { Step, StepDetailsProps } from '@yeager-dev/ui';
import type { PendingSwapStep } from 'rango-types';

import React from 'react';

import {
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
} from '../../constants/routing';
import { getBlockchainShortNameFor } from '../../utils/meta';
import { numberToString } from '../../utils/numbers';
import { isNetworkStatusInWarningState } from '../../utils/swap';
import { SwapDetailsAlerts } from '../SwapDetailsAlerts';

export const RESET_INTERVAL = 2_000;
export const SECONDS = 60;

export const getSteps = ({ swap, blockchains, ...args }: GetStep): Step[] => {
  const hasAlreadyProceededToSign = swap.hasAlreadyProceededToSign !== false;
  return swap.steps.map((step, index) => {
    const amountToConvert =
      index === 0
        ? swap.inputAmount
        : swap.steps[index - 1].outputAmount ||
          swap.steps[index - 1].expectedOutputAmountHumanReadable;
    return {
      from: {
        token: { displayName: step.fromSymbol, image: step.fromLogo ?? '' },
        chain: {
          displayName:
            getBlockchainShortNameFor(step.fromBlockchain, blockchains) ?? '',
          image: step.fromBlockchainLogo ?? '',
        },
        price: {
          value: numberToString(
            amountToConvert,
            TOKEN_AMOUNT_MIN_DECIMALS,
            TOKEN_AMOUNT_MAX_DECIMALS
          ),
          realValue: amountToConvert,
        },
      },
      to: {
        token: { displayName: step.toSymbol, image: step.toLogo },
        chain: {
          displayName:
            getBlockchainShortNameFor(step.toBlockchain, blockchains) ?? '',
          image: step.toBlockchainLogo ?? '',
        },
        price: {
          value: numberToString(
            step.outputAmount || step.expectedOutputAmountHumanReadable,
            TOKEN_AMOUNT_MIN_DECIMALS,
            TOKEN_AMOUNT_MAX_DECIMALS
          ),
          realValue:
            step.outputAmount || step.expectedOutputAmountHumanReadable,
        },
      },
      swapper: { displayName: step.swapperId, image: step.swapperLogo ?? '' },
      alerts: (
        <SwapDetailsAlerts
          step={step}
          hasAlreadyProceededToSign={hasAlreadyProceededToSign}
          {...args}
        />
      ),
    };
  });
};

export function getStepState(step: PendingSwapStep): StepDetailsProps['state'] {
  if (
    isNetworkStatusInWarningState(step) &&
    step.status !== 'failed' &&
    step.status !== 'success'
  ) {
    return 'warning';
  }

  switch (step.status) {
    case 'created':
      return 'default';
    case 'approved':
    case 'waitingForApproval':
    case 'running':
      return 'in-progress';
    case 'failed':
      return 'error';
    case 'success':
      return 'completed';
  }
}
