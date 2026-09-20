/* eslint-disable @typescript-eslint/no-magic-numbers */
import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { suiHooks } from './sui.js';

const { convertSlushRejectionError } = suiHooks;

describe('convertSlushRejectionError', () => {
  it('convert a rejected trpc request to a user rejection and keep the message', () => {
    const trpcError = Object.assign(new Error('User rejected the request.'), {
      name: 'TRPCClientError',
      shape: {
        code: -32603,
        message: 'User rejected the request.',
      },
    });

    const converted = convertSlushRejectionError(undefined, trpcError);

    expect(converted).toBeInstanceOf(Error);
    expect(converted).toHaveProperty('message', 'User rejected the request.');
    expect(converted).toHaveProperty('code', USER_REJECTION_ERROR_CODE);
  });

  it('return unrecognised errors unchanged', () => {
    const error = new Error('Something went wrong.');

    expect(convertSlushRejectionError(undefined, error)).toBe(error);
  });
});
