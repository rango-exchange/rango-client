import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { utxoHooks } from './utxo.js';

const { convertXverseRejectionError } = utxoHooks;

describe('convertXverseRejectionError', () => {
  it('convert a closed wallet popup to a user rejection and keep the message', () => {
    const converted = convertXverseRejectionError(
      undefined,
      new Error('User closed the wallet popup.')
    );

    expect(converted).toBeInstanceOf(Error);
    expect(converted).toHaveProperty(
      'message',
      'User closed the wallet popup.'
    );
    expect(converted).toHaveProperty('code', USER_REJECTION_ERROR_CODE);
  });

  it('return unrecognised errors unchanged', () => {
    const error = new Error('Something went wrong.');

    expect(convertXverseRejectionError(undefined, error)).toBe(error);
  });
});
