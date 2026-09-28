/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  WalletConnectionError,
} from '@hub3js/std/utils';
import { describe, expect, it } from 'vitest';

import {
  classifyLedgerConnectionError,
  getLedgerError,
  toLedgerConnectionError,
} from './utils.js';

function createLedgerError(name: string, message: string, statusCode?: number) {
  const error = new Error(message);
  error.name = name;
  return Object.assign(error, { statusCode });
}

describe('ledger connection error', () => {
  it('classify the 0x5515 status code as locked', () => {
    const error = createLedgerError(
      'LockedDeviceError',
      'Ledger device: Locked device (0x5515)',
      0x5515
    );

    expect(classifyLedgerConnectionError(error)).toBe(
      ConnectionErrorType.Locked
    );
  });

  it('classify a locked device from the status code whatever the message says', () => {
    const error = createLedgerError('TransportStatusError', 'Reworded', 0x5515);

    expect(classifyLedgerConnectionError(error)).toBe(
      ConnectionErrorType.Locked
    );
  });

  it('classify the 0x6985 status code as rejected', () => {
    const error = createLedgerError(
      'TransportStatusError',
      'Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)',
      0x6985
    );

    expect(classifyLedgerConnectionError(error)).toBe(
      ConnectionErrorType.Rejected
    );
  });

  it('classify a dismissed device picker as rejected', () => {
    const error = createLedgerError(
      'TransportOpenUserCancelled',
      'Access denied to use Ledger device'
    );

    expect(classifyLedgerConnectionError(error)).toBe(
      ConnectionErrorType.Rejected
    );
  });

  it('classify a 4001 code as rejected', () => {
    expect(
      classifyLedgerConnectionError({
        code: 4001,
        message: 'User rejected the request.',
      })
    ).toBe(ConnectionErrorType.Rejected);
  });

  it('classify any other status code as unknown', () => {
    const error = createLedgerError(
      'TransportStatusError',
      'Wrong app',
      0x650f
    );

    expect(classifyLedgerConnectionError(error)).toBe(
      ConnectionErrorType.Unknown
    );
  });

  it('classify the locked message without its status code as unknown', () => {
    expect(
      classifyLedgerConnectionError(new Error('The device is locked'))
    ).toBe(ConnectionErrorType.Unknown);
  });

  it('classify a value that is not an object as unknown', () => {
    expect(classifyLedgerConnectionError('Locked device (0x5515)')).toBe(
      ConnectionErrorType.Unknown
    );
    expect(classifyLedgerConnectionError(undefined)).toBe(
      ConnectionErrorType.Unknown
    );
  });

  it('carry the friendly message for a locked device', () => {
    const error = createLedgerError(
      'LockedDeviceError',
      'Ledger device: Locked device (0x5515)',
      0x5515
    );

    const result = toLedgerConnectionError(error);

    expect(result).toBeInstanceOf(WalletConnectionError);
    expect(result).toMatchObject({
      type: ConnectionErrorType.Locked,
      message: 'The device is locked',
      cause: error,
    });
  });

  it('carry the friendly message for a denied action', () => {
    const error = createLedgerError('TransportStatusError', 'Denied', 0x6985);

    expect(toLedgerConnectionError(error)).toMatchObject({
      type: ConnectionErrorType.Rejected,
      message: 'Action denied by user',
      cause: error,
    });
  });

  it('carry the friendly message for an application that is not ready', () => {
    const error = createLedgerError(
      'TransportStatusError',
      'Ledger device: UNKNOWN_ERROR (0x650f)',
      0x650f
    );

    expect(toLedgerConnectionError(error)).toMatchObject({
      type: ConnectionErrorType.Unknown,
      message: 'Related application is not ready on your device',
      cause: error,
    });
  });

  it('fall back to the ledger status message for any other status code', () => {
    const error = createLedgerError('TransportStatusError', 'Raw', 0x6a80);

    const result = toLedgerConnectionError(error);

    expect(result.type).toBe(ConnectionErrorType.Unknown);
    expect(result.message).toBe(getLedgerError(error).message);
    expect(result.message).not.toBe('Raw');
  });

  it('keep the raw message of an error without a status code', () => {
    const error = createLedgerError(
      'TransportOpenUserCancelled',
      'Access denied to use Ledger device'
    );

    expect(toLedgerConnectionError(error)).toMatchObject({
      type: ConnectionErrorType.Rejected,
      message: 'Access denied to use Ledger device',
      cause: error,
    });
  });

  it('fall back to the fixed message of an error without a status code or a message', () => {
    const error = createLedgerError('TransportOpenUserCancelled', '');

    expect(toLedgerConnectionError(error)).toMatchObject({
      type: ConnectionErrorType.Rejected,
      message: CONNECTION_ERROR_MESSAGES[ConnectionErrorType.Rejected],
      cause: error,
    });
  });
});
