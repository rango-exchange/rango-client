/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ConnectionErrorType } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { classifyReadyConnectionError } from './starknet.js';

describe('ready starknet connection error', () => {
  it('classify the recorded rejection as rejected', () => {
    expect(classifyReadyConnectionError(new Error('User aborted'))).toBe(
      ConnectionErrorType.Rejected
    );
  });

  it('classify a 4001 code as rejected', () => {
    expect(
      classifyReadyConnectionError({
        code: 4001,
        message: 'User rejected the request.',
      })
    ).toBe(ConnectionErrorType.Rejected);
  });

  it('classify an error with another message as unknown', () => {
    expect(classifyReadyConnectionError(new Error('Wallet not found'))).toBe(
      ConnectionErrorType.Unknown
    );
  });

  it('classify the braavos connection error text as unknown', () => {
    expect(
      classifyReadyConnectionError(new Error('Error during connection'))
    ).toBe(ConnectionErrorType.Unknown);
  });
});
