import type { Manager } from '@rango-dev/queue-manager-core';
import type { PendingSwap } from '@rango-dev/queue-manager-rango-preset';

import {
  getCurrentBlockchainOfOrNull,
  getCurrentStep,
  getRelatedWalletOrNull,
} from '@rango-dev/queue-manager-rango-preset';

import { getPendingSwaps } from '../../utils/queue';

export class WidgetHistory {
  private manager: Manager | undefined;

  constructor(manager: Manager | undefined) {
    this.manager = manager;
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
