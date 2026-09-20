import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { starknetHooks } from './starknet.js';

const { convertReadyRejectionError } = starknetHooks;

describe('convertReadyRejectionError', () => {
  it('convert an aborted request to a user rejection and keep the message', () => {
    const converted = convertReadyRejectionError(
      undefined,
      new Error('User aborted')
    );

    expect(converted).toBeInstanceOf(Error);
    expect(converted).toHaveProperty('message', 'User aborted');
    expect(converted).toHaveProperty('code', USER_REJECTION_ERROR_CODE);
  });

  it('return unrecognised errors unchanged', () => {
    const error = new Error('Something went wrong.');

    expect(convertReadyRejectionError(undefined, error)).toBe(error);
  });
});
