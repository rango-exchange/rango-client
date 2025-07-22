import type { Meta, RetryQuote } from '../../store/quote';
import type { FindToken } from '../../store/slices/data';
import type { Manager } from '@arlert-dev/queue-manager-core';
import type { PendingSwap } from 'rango-types/lib';

import {
  cancelSwap,
  getCurrentNamespaceOfOrNull,
  getCurrentStep,
  getRelatedWalletOrNull,
} from '@arlert-dev/queue-manager-rango-preset';

import { getPendingSwaps } from '../../utils/queue';
import { createRetryQuote } from '../../utils/quote';

interface WidgetHistoryActions {
  retrySwap: (retryQuote: RetryQuote) => void;
  findToken: FindToken;
}

export class WidgetHistory {
  private manager: Manager | undefined;
  private actions: WidgetHistoryActions;

  constructor(manager: Manager | undefined, actions: WidgetHistoryActions) {
    this.manager = manager;
    this.actions = actions;
  }

  public getAllSwaps() {
    return getPendingSwaps(this.manager);
  }

  public getCurrentStep(swap: PendingSwap) {
    return this.getCurrentStepInfo(swap).step;
  }

  public getCurrentStepWallet(swap: PendingSwap) {
    return this.getCurrentStepInfo(swap).wallet;
  }

  public getCurrentStepNetwork(swap: PendingSwap) {
    return this.getCurrentStepInfo(swap).network;
  }

  public retry(swap: PendingSwap, meta: Meta) {
    const retryQuote = createRetryQuote(
      swap,
      meta.blockchains,
      this.actions.findToken
    );

    return this.actions.retrySwap(retryQuote);
  }

  public cancel(id: string) {
    const queue = this.manager?.get(id);
    if (queue) {
      cancelSwap(queue);
    }
  }

  private getCurrentStepInfo(swap: PendingSwap) {
    const currentStep = getCurrentStep(swap);
    return {
      step: currentStep,
      wallet: currentStep ? getRelatedWalletOrNull(swap, currentStep) : null,
      network: currentStep
        ? getCurrentNamespaceOfOrNull(swap, currentStep)?.network
        : null,
    };
  }
}
