import type { WalletType } from '@yeager-dev/wallets-shared';
import type { PendingSwap, PendingSwapStep } from 'rango-types';

import * as Sentry from '@sentry/browser';

export function logRPCError(
  error: unknown,
  swap: PendingSwap,
  currentStep: PendingSwapStep | undefined,
  walletType: WalletType | undefined
): void {
  try {
    Sentry.captureException(error, {
      tags: {
        requestId: swap.requestId,
        rpc: true,
        swapper: currentStep?.swapperId || '',
        walletType: walletType || '',
      },
      level: 'warning' as any,
    });
  } catch (e) {
    console.log({ e });
  }
}
