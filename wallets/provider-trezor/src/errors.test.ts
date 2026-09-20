import { describe, expect, it } from 'vitest';

import { createTrezorConnectError } from './errors.js';

describe('createTrezorConnectError', () => {
  it('keep the trezor code alongside the message', () => {
    const error = createTrezorConnectError({
      error: 'Popup closed',
      code: 'Method_Interrupted',
    });

    expect(error.message).toBe('Popup closed');
    expect(error).toHaveProperty('code', 'Method_Interrupted');
  });

  it('leave the code out when trezor sends none', () => {
    const error = createTrezorConnectError({ error: 'Unknown failure' });

    expect(error.message).toBe('Unknown failure');
    expect(error).not.toHaveProperty('code');
  });
});
