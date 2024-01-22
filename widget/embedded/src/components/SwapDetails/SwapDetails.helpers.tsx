import type { GetStep } from '../SwapDetailsAlerts';
import type { Step, StepDetailsProps } from '@rango-dev/ui';
import type { PendingSwapStep } from 'rango-types';

import React from 'react';

import {
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
} from '../../constants/routing';
import {
  getBlockchainShortNameFor,
  getSwapperDisplayName,
} from '../../utils/meta';
import { numberToString } from '../../utils/numbers';
import { isNetworkStatusInWarningState } from '../../utils/swap';
import { SwapDetailsAlerts } from '../SwapDetailsAlerts';

export const RESET_INTERVAL = 2_000;
export const SECONDS = 60;

export const getSteps = ({
  swap,
  blockchains,
  swappers,
  ...args
}: GetStep): Step[] => {
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
      swapper: {
        displayName: getSwapperDisplayName(step.swapperId, swappers),
        image: step.swapperLogo ?? '',
        type: step.swapperType,
      },
      internalSwaps: step.internalSwaps
        ? step.internalSwaps.map((internalSwap) => {
            return {
              from: {
                blockchain:
                  getBlockchainShortNameFor(
                    internalSwap.fromBlockchain,
                    blockchains
                  ) ?? '',
              },
              to: {
                blockchain:
                  getBlockchainShortNameFor(
                    internalSwap.toBlockchain,
                    blockchains
                  ) ?? '',
              },
              swapper: {
                displayName: getSwapperDisplayName(
                  internalSwap.swapperId,
                  swappers
                ),
                image: internalSwap.swapperLogo ?? '',
                type: internalSwap.swapperType,
              },
            };
          })
        : [],
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
