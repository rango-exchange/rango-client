import { SwapProgressNotification } from "@rango-dev/queue-manager-rango-preset/dist/shared";

export function notifier({ eventType, swap, step }: SwapProgressNotification) {
  console.log('[notifier]', { eventType, swap, step });
}