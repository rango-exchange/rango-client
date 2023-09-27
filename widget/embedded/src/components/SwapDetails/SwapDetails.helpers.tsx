import type { GetStep } from '../SwapDetailsAlerts';
import type { PendingSwapStep } from '@rango-dev/queue-manager-rango-preset';
import type {
  PriceImpactWarningLevel,
  Step,
  StepDetailsProps,
} from '@rango-dev/ui';
import type BigNumber from 'bignumber.js';

import React from 'react';

import { numberToString } from '../../utils/numbers';
import { isNetworkStatusInWarningState } from '../../utils/swap';
import { SwapDetailsAlerts } from '../SwapDetailsAlerts';

export const LOW_PRICE_IMPACT = 3;
export const HIGHT_PRICE_IMPACT = 10;
export const RESET_INTERVAL = 2_000;
export const MIN_DECIMALS = 0;
export const AMOUNT_DECIMALS = 4;
export const PERCENT_DECIMALS = 2;
export const SECONDS = 60;

export const getSteps = ({ swap, ...args }: GetStep): Step[] => {
  const hasAlreadyProceededToSign = swap.hasAlreadyProceededToSign !== false;
  return swap.steps.map((step, index) => {
    const amountToConvert =
      index === 0 ? swap.inputAmount : swap.steps[index - 1].outputAmount;
    return {
      from: {
        token: { displayName: step.fromSymbol, image: step.fromLogo },
        chain: {
          displayName: step.fromBlockchain,
          image: step.fromBlockchainLogo,
        },
        price: {
          value: numberToString(
            amountToConvert,
            AMOUNT_DECIMALS,
            AMOUNT_DECIMALS
          ),
        },
      },
      to: {
        token: { displayName: step.toSymbol, image: step.toLogo },
        chain: {
          displayName: step.toBlockchain,
          image: step.toBlockchainLogo,
        },
        price: {
          value: numberToString(
            step.outputAmount || step.expectedOutputAmountHumanReadable,
            AMOUNT_DECIMALS,
            AMOUNT_DECIMALS
          ),
        },
      },
      swapper: { displayName: step.swapperId, image: step.swapperLogo },
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

export const getPriceImpactWarningLevel = (
  priceImpact: BigNumber | null
): PriceImpactWarningLevel | undefined => {
  if (!priceImpact) {
    return undefined;
  } else if (priceImpact.lt(LOW_PRICE_IMPACT)) {
    return 'low';
  }
  return 'high';
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
