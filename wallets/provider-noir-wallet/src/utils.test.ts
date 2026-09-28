/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ConnectionErrorType } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { classifyNoirConnectionError } from './utils.js';

describe('noir utxo connection error', () => {
  it('classify the recorded rejection as rejected', () => {
    expect(
      classifyNoirConnectionError(new Error('User rejected the request'))
    ).toBe(ConnectionErrorType.Rejected);
  });

  it('classify a 4001 code as rejected', () => {
    expect(
      classifyNoirConnectionError({
        code: 4001,
        message: 'User rejected the request.',
      })
    ).toBe(ConnectionErrorType.Rejected);
  });

  it('classify an error with another message as unknown', () => {
    expect(
      classifyNoirConnectionError(new Error('User rejected the request.'))
    ).toBe(ConnectionErrorType.Unknown);
  });

  it('classify a plain object with the rejection message as unknown', () => {
    expect(
      classifyNoirConnectionError({ message: 'User rejected the request' })
    ).toBe(ConnectionErrorType.Unknown);
  });
});
