import type { Context } from '../../hub/namespaces/mod.js';

export function intoConnecting() {
  return [
    'connect',
    (context: Context) => {
      const [, setState] = context.state();
      setState('connecting', true);
    },
  ] as const;
}

// Please consider if you are going to add something here, make sure it works on all namespaces.
export const recommended = [intoConnecting()];
