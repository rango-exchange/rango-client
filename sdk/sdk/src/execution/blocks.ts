import type { Transition } from './transitions';
import type { StepBlock, SwapExecution } from './types';

/** Whether the execution's current step is parked waiting on this wallet. */
export function isBlockedOnWallet(
  exec: SwapExecution,
  walletType: string
): boolean {
  return exec.steps.some(
    (step) =>
      step.status === 'running' && step.blocked?.walletType === walletType
  );
}

/** Whether a block says the same thing as the one already on record. Blocks hold only primitives. */
export function isSameBlock(
  current: StepBlock | null,
  block: StepBlock
): boolean {
  if (!current) {
    return false;
  }
  const a = current as Record<string, unknown>;
  const b = block as Record<string, unknown>;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return Array.from(keys).every((key) => a[key] === b[key]);
}

/**
 * The transitions an action produced, with `unblocked` in front when the
 * step was parked and the action got past the guard that parked it. A step
 * that is parked again keeps its block, replaced by the new one.
 */
export function liftBlock(
  exec: SwapExecution,
  stepIndex: number,
  transitions: Transition[]
): Transition[] {
  const step = exec.steps[stepIndex];
  if (!step?.blocked || transitions[0]?.type === 'blocked') {
    return transitions;
  }
  return [{ type: 'unblocked', stepIndex }, ...transitions];
}
