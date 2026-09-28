/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ConnectionErrorType } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { classifyWalletConnectConnectionError } from './utils.js';

describe('walletconnect evm connection error', () => {
  it.each([
    [5000, 'User rejected.'],
    [5002, 'User rejected methods.'],
  ])('classify the documented %s rejection as rejected', (code, message) => {
    expect(classifyWalletConnectConnectionError({ code, message })).toBe(
      ConnectionErrorType.Rejected
    );
  });

  it('classify the recorded 4001 rejection as rejected', () => {
    expect(
      classifyWalletConnectConnectionError({
        code: 4001,
        message: 'User disapproved requested methods',
      })
    ).toBe(ConnectionErrorType.Rejected);
  });

  it('classify an error with another code as unknown', () => {
    expect(
      classifyWalletConnectConnectionError({
        code: 5100,
        message: 'Unsupported chains.',
      })
    ).toBe(ConnectionErrorType.Unknown);
  });
});
