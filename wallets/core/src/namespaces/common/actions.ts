import type { Context } from '../../hub/namespaces/mod.js';

export function disconnect(context: Context): void {
  const [, setState] = context.state();
  setState('network', null);
  setState('accounts', null);
  setState('connected', false);
  setState('connecting', false);
  setState('connectArgs', null);
}

export const recommended = [['disconnect', disconnect] as const];
