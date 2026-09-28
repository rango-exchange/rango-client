/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ConnectionErrorType } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { classifyXverseConnectionError } from './utxo.js';

describe('xverse utxo connection error', () => {
  it('classify the recorded rejection as rejected', () => {
    expect(
      classifyXverseConnectionError(new Error('User closed the wallet popup.'))
    ).toBe(ConnectionErrorType.Rejected);
  });

  it('classify a 4001 code as rejected', () => {
    expect(
      classifyXverseConnectionError({
        code: 4001,
        message: 'User rejected the request.',
      })
    ).toBe(ConnectionErrorType.Rejected);
  });

  it('classify an error with another message as unknown', () => {
    expect(
      classifyXverseConnectionError(new Error('Wallet is not installed.'))
    ).toBe(ConnectionErrorType.Unknown);
  });

  it('classify a plain object with the rejection message as unknown', () => {
    expect(
      classifyXverseConnectionError({
        message: 'User closed the wallet popup.',
      })
    ).toBe(ConnectionErrorType.Unknown);
  });
});
