/* eslint-disable @typescript-eslint/no-magic-numbers */
import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { convertFreighterRejectionError } from './errors.js';

describe('convertFreighterRejectionError', () => {
  it('convert the freighter rejection code to a user rejection and keep the message', () => {
    const converted = convertFreighterRejectionError(undefined, {
      code: -4,
      message: 'The user rejected this request.',
    });

    expect(converted).toBeInstanceOf(Error);
    expect(converted).toHaveProperty(
      'message',
      'The user rejected this request.'
    );
    expect(converted).toHaveProperty('code', USER_REJECTION_ERROR_CODE);
  });

  it('keep a message that is not a string on the converted error', () => {
    const converted = convertFreighterRejectionError(undefined, {
      code: -4,
      message: 123,
    });

    expect(converted).toHaveProperty('message', '123');
    expect(converted).toHaveProperty('code', USER_REJECTION_ERROR_CODE);
  });

  it('return errors with another code unchanged', () => {
    const error = { code: -1, message: 'The wallet encountered an error.' };

    expect(convertFreighterRejectionError(undefined, error)).toBe(error);
  });
});
