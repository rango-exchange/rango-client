/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ConnectionErrorType } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { classifyFreighterConnectionError } from './utils.js';

describe('freighter stellar connection error', () => {
  it('classify the recorded declined error as rejected', () => {
    expect(
      classifyFreighterConnectionError({
        code: -4,
        message: 'The user rejected this request.',
      })
    ).toBe(ConnectionErrorType.Rejected);
  });

  it('classify a 4001 code as rejected', () => {
    expect(
      classifyFreighterConnectionError({
        code: 4001,
        message: 'User rejected the request.',
      })
    ).toBe(ConnectionErrorType.Rejected);
  });

  it('classify an error with another code as unknown', () => {
    expect(
      classifyFreighterConnectionError({
        code: -1,
        message: 'The wallet encountered an error.',
      })
    ).toBe(ConnectionErrorType.Unknown);
  });

  it('classify an error without a code as unknown', () => {
    expect(
      classifyFreighterConnectionError(
        new Error('The user rejected this request.')
      )
    ).toBe(ConnectionErrorType.Unknown);
  });
});
