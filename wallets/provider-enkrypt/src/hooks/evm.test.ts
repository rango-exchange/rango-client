import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { evmHooks } from './evm.js';

const { convertEnkryptRejectionError } = evmHooks;

describe('convertEnkryptRejectionError', () => {
  it('turn the thrown rejection string into an error with the user rejection code', () => {
    const converted = convertEnkryptRejectionError(
      undefined,
      'User Rejected Request: The user rejected the request.'
    );

    expect(converted).toBeInstanceOf(Error);
    expect(converted).toHaveProperty(
      'message',
      'User Rejected Request: The user rejected the request.'
    );
    expect(converted).toHaveProperty('code', USER_REJECTION_ERROR_CODE);
  });

  it('return other thrown strings unchanged', () => {
    expect(
      convertEnkryptRejectionError(undefined, 'Something went wrong.')
    ).toBe('Something went wrong.');
  });

  it('return unrecognised errors unchanged', () => {
    const error = new Error('Something went wrong.');

    expect(convertEnkryptRejectionError(undefined, error)).toBe(error);
  });
});
