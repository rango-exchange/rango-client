import type { Meta } from '../../store/quote';
import type { Manager } from '@rango-dev/queue-manager-core';
import type { PendingSwap } from 'rango-types/lib';

import {
  cancelSwap,
  getCurrentBlockchainOfOrNull,
  getCurrentStep,
  getRelatedWalletOrNull,
} from '@rango-dev/queue-manager-rango-preset';

import { getPendingSwaps } from '../../utils/queue';

interface WidgetHistoryActions {
  retrySwap: (pendingSwap: PendingSwap, meta: Meta) => void;
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
    return this.actions.retrySwap(swap, meta);
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
        ? getCurrentBlockchainOfOrNull(swap, currentStep)
        : null,
    };
  }
}
