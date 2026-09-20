/* eslint-disable @typescript-eslint/no-magic-numbers */
import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { convertWalletConnectRejectionError } from './hooks.js';

describe('convertWalletConnectRejectionError', () => {
  it.each([
    ['the wallet side user rejected code', 5000, 'User rejected.'],
    [
      'the wallet side user rejected methods code',
      5002,
      'User rejected methods.',
    ],
  ])(
    'convert %s to a user rejection and keep the message',
    (_label, code, message) => {
      const converted = convertWalletConnectRejectionError(undefined, {
        code,
        message,
      });

      expect(converted).toBeInstanceOf(Error);
      expect(converted).toHaveProperty('message', message);
      expect(converted).toHaveProperty('code', USER_REJECTION_ERROR_CODE);
    }
  );

  it('keep a message that is not a string on the converted error', () => {
    const converted = convertWalletConnectRejectionError(undefined, {
      code: 5000,
      message: 123,
    });

    expect(converted).toHaveProperty('message', '123');
    expect(converted).toHaveProperty('code', USER_REJECTION_ERROR_CODE);
  });

  it('return a rejection that already has the user rejection code unchanged', () => {
    const error = {
      code: USER_REJECTION_ERROR_CODE,
      message: 'User disapproved requested methods',
    };

    expect(convertWalletConnectRejectionError(undefined, error)).toBe(error);
  });

  it('return other wallet side errors unchanged', () => {
    const error = { code: 5100, message: 'Unsupported chains.' };

    expect(convertWalletConnectRejectionError(undefined, error)).toBe(error);
  });
});
