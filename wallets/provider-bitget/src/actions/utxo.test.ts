/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ConnectionErrorType } from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import { classifyBitgetUtxoConnectionError } from './utxo.js';

describe('bitget utxo connection error', () => {
  it('classify the recorded utxo rejection as rejected', () => {
    expect(
      classifyBitgetUtxoConnectionError({
        code: -32603,
        message: 'User rejected the request',
      })
    ).toBe(ConnectionErrorType.Rejected);
  });

  it('classify a 4001 code as rejected', () => {
    expect(
      classifyBitgetUtxoConnectionError({
        code: 4001,
        message: 'User rejected the request.',
      })
    ).toBe(ConnectionErrorType.Rejected);
  });

  it('classify an internal error with another message as unknown', () => {
    expect(
      classifyBitgetUtxoConnectionError({
        code: -32603,
        message: 'Internal error',
      })
    ).toBe(ConnectionErrorType.Unknown);
  });

  it('classify the rejection message with another code as unknown', () => {
    expect(
      classifyBitgetUtxoConnectionError({
        code: -32000,
        message: 'User rejected the request',
      })
    ).toBe(ConnectionErrorType.Unknown);
  });

  it('classify a value that is not an object as unknown', () => {
    expect(classifyBitgetUtxoConnectionError('User rejected the request')).toBe(
      ConnectionErrorType.Unknown
    );
  });
});
