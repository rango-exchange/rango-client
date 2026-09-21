/**
 * Calls every listener with the event, each on its own: one that throws is
 * reported and skipped, so a bug in a host's rendering cannot stop a swap.
 */
export function notifyListeners<T>(
  listeners: Iterable<(event: T) => void>,
  event: T
): void {
  for (const listener of listeners) {
    try {
      listener(event);
    } catch (error) {
      console.error('An SDK event listener threw', error);
    }
  }
}
