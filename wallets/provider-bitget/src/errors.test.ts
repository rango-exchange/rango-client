/* eslint-disable @typescript-eslint/no-magic-numbers */
import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { convertBitgetUtxoRejectionError } from './errors.js';

describe('convertBitgetUtxoRejectionError', () => {
  it('convert an internal error with the rejection message to a user rejection and keep the message', () => {
    const converted = convertBitgetUtxoRejectionError(undefined, {
      code: -32603,
      message: 'User rejected the request',
    });

    expect(converted).toBeInstanceOf(Error);
    expect(converted).toHaveProperty('message', 'User rejected the request');
    expect(converted).toHaveProperty('code', USER_REJECTION_ERROR_CODE);
  });

  it('return an internal error without the rejection message unchanged', () => {
    const error = { code: -32603, message: 'Internal JSON-RPC error.' };

    expect(convertBitgetUtxoRejectionError(undefined, error)).toBe(error);
  });

  it('return the rejection message with another code unchanged', () => {
    const error = { code: -32000, message: 'User rejected the request' };

    expect(convertBitgetUtxoRejectionError(undefined, error)).toBe(error);
  });
});
