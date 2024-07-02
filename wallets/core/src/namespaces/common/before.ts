import type { Context } from '../../hub/namespaces/mod.js';

export function intoConnecting(context: Context) {
  const [, setState] = context.state();
  setState('connecting', true);
}

// Please consider if you are going to add something here, make sure it works on all namespaces.
export const recommended = [['connect', intoConnecting] as const];
