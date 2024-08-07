import type { Context } from '../../hub/namespaces/mod.js';

export function intoConnectionFinished(context: Context) {
  const [, setState] = context.state();
  setState('connecting', false);
}

export const recommended = [['connect', intoConnectionFinished] as const];
