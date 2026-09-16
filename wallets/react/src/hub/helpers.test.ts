import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';
import { Err, Ok } from 'ts-results';
import { describe, expect, it } from 'vitest';

import {
  buildAutoConnectFailedEventValue,
  collectConnectFailures,
} from './helpers.js';

const connected = new Ok({ accounts: [], network: null });

describe('collectConnectFailures', () => {
  it('list every failed namespace in request order with the network passed for it', () => {
    const evmError = new Error('EVM failed');
    const suiError = new Error('Sui failed');

    const failures = collectConnectFailures([
      { namespace: 'EVM', network: 'ETH', result: new Err(evmError) },
      { namespace: 'Solana', network: undefined, result: connected },
      { namespace: 'Sui', network: undefined, result: new Err(suiError) },
    ]);

    expect(failures).toEqual([
      { namespace: 'EVM', network: 'ETH', error: evmError },
      { namespace: 'Sui', network: undefined, error: suiError },
    ]);
  });

  it('keep the rejecting error object on namespaces cancelled after a rejection', () => {
    const rejection = Object.assign(new Error('User rejected the request.'), {
      code: USER_REJECTION_ERROR_CODE,
    });

    const failures = collectConnectFailures([
      { namespace: 'EVM', result: new Err(rejection) },
      { namespace: 'Solana', result: new Err(rejection) },
    ]);

    expect(failures.map((failure) => failure.error)).toEqual([
      rejection,
      rejection,
    ]);
    expect(failures[1].error).toBe(failures[0].error);
  });

  it('return no failures when every namespace connected', () => {
    expect(
      collectConnectFailures([
        { namespace: 'EVM', network: 'ETH', result: connected },
      ])
    ).toEqual([]);
  });
});

describe('buildAutoConnectFailedEventValue', () => {
  it('send no event when no namespace was attempted', () => {
    /*
     * Config errors (a saved wallet that isn't registered, or a saved namespace
     * that doesn't match) stop auto-connect before any namespace is attempted.
     */
    expect(buildAutoConnectFailedEventValue([])).toBeUndefined();
  });

  it('send no event when every attempted namespace connected', () => {
    expect(
      buildAutoConnectFailedEventValue([
        { namespace: 'EVM', network: 'ETH', result: connected },
        { namespace: 'Solana', result: connected },
      ])
    ).toBeUndefined();
  });

  it('list every attempted namespace in order as the requested namespaces', () => {
    const value = buildAutoConnectFailedEventValue([
      { namespace: 'Solana', result: connected },
      { namespace: 'EVM', network: 'ETH', result: new Err(new Error('fail')) },
      { namespace: 'Sui', result: connected },
    ]);

    expect(value?.requestedNamespaces).toEqual(['Solana', 'EVM', 'Sui']);
  });

  it('keep only the attempted namespaces that failed in failures, with the network auto-connect passed', () => {
    const evmError = new Error('EVM failed');

    const value = buildAutoConnectFailedEventValue([
      { namespace: 'EVM', network: 'ETH', result: new Err(evmError) },
      { namespace: 'Solana', result: connected },
    ]);

    expect(value?.failures).toEqual([
      { namespace: 'EVM', network: 'ETH', error: evmError },
    ]);
  });
});
