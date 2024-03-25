import type { Context } from '../../hub/namespace';

function intoConnectionFinished() {
  return [
    'connect',
    (context: Context) => {
      const [, setState] = context.state();
      setState('connecting', false);
      setState('connected', true);
    },
  ] as const;
}

export const recommended = [intoConnectionFinished()];
