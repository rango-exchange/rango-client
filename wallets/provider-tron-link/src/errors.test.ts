import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { convertTronLinkRejectionError } from './errors.js';

describe('convertTronLinkRejectionError', () => {
  it('convert a rejected request to a user rejection and keep the message', () => {
    const converted = convertTronLinkRejectionError(
      undefined,
      new Error('User rejected the request.')
    );

    expect(converted).toBeInstanceOf(Error);
    expect(converted).toHaveProperty('message', 'User rejected the request.');
    expect(converted).toHaveProperty('code', USER_REJECTION_ERROR_CODE);
  });

  it('return unrecognised errors unchanged', () => {
    const error = new Error('Something went wrong.');

    expect(convertTronLinkRejectionError(undefined, error)).toBe(error);
  });
});
