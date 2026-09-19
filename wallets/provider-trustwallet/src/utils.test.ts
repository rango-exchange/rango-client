import type { Context } from '@hub3js/core';

import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { standardizeTrustWalletInAppBrowserError } from './utils.js';

const context = {} as Context;

describe('standardizeTrustWalletInAppBrowserError', () => {
  it('convert the cancelled string to an error with the user rejection code', () => {
    const converted = standardizeTrustWalletInAppBrowserError(
      context,
      'cancelled'
    );

    expect(converted).toBeInstanceOf(Error);
    expect(converted).toHaveProperty('message', 'User rejected the request');
    expect(converted).toHaveProperty('code', USER_REJECTION_ERROR_CODE);
  });

  it('return unrecognised errors unchanged', () => {
    const error = new Error('Something went wrong.');

    expect(standardizeTrustWalletInAppBrowserError(context, error)).toBe(error);
  });
});
