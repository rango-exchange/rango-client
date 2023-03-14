import { WalletType } from '@rango-dev/wallets-shared';
import * as Sentry from '@sentry/browser';
import { PendingSwap, PendingSwapStep } from './shared';

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
      level: 'warning',
    });
  } catch (e) {
    console.log({ e });
  }
}
