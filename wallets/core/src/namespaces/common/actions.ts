import type { Context } from '../../hub/namespace';

export function disconnect() {
  return [
    'disconnect',
    (context: Context) => {
      const [, setState] = context.state();
      setState('network', null);
      setState('accounts', null);
      setState('connected', false);
      setState('connecting', false);
    },
  ] as const;
}

export const recommended = [disconnect()];
