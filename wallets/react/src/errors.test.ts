import type { NamespaceInputForConnect } from './legacy/types.js';

import {
  USER_REJECTION_ERROR_CODE,
  WalletConnectionError,
} from '@hub3js/std/utils';
import { Err, None, Ok, Some } from 'ts-results';
import { describe, expect, it } from 'vitest';

import {
  AutoConnectionAttemptError,
  buildAutoConnectionAttemptError,
  buildConnectionAttemptError,
  WalletConnectionAttemptError,
} from './errors.js';

const connected = new Ok({ accounts: [], network: null });

const SOLANA_DERIVATION_PATH = "m/44'/501'/0'/0'";
const evm: NamespaceInputForConnect = { namespace: 'EVM', network: 'ETH' };
const solana: NamespaceInputForConnect = {
  namespace: 'Solana',
  network: undefined,
  derivationPath: SOLANA_DERIVATION_PATH,
};
const sui: NamespaceInputForConnect = { namespace: 'Sui', network: undefined };
const requestedNamespaces = [evm, solana, sui];

function rejection() {
  return Object.assign(new Error('User rejected the request.'), {
    code: USER_REJECTION_ERROR_CODE,
  });
}

describe('WalletConnectionAttemptError', () => {
  it('keep its entries and requested namespaces', () => {
    const entry = new Error('EVM failed');

    const error = new WalletConnectionAttemptError({
      errors: [entry],
      requestedNamespaces,
    });

    expect(error).toBeInstanceOf(AggregateError);
    expect(error.errors).toEqual([entry]);
    expect(error.errors[0]).toBe(entry);
    expect(error.requestedNamespaces).toEqual(requestedNamespaces);
  });

  it('take its message from the first entry', () => {
    const error = new WalletConnectionAttemptError({
      errors: [new Error('first'), new Error('second')],
      requestedNamespaces: [],
    });

    expect(error.message).toBe('first');
  });

  it('use the string form of a first entry without a string message', () => {
    expect(
      new WalletConnectionAttemptError({
        errors: ['thrown string'],
        requestedNamespaces: [],
      }).message
    ).toBe('thrown string');
    expect(
      new WalletConnectionAttemptError({
        errors: [{ message: 123 }],
        requestedNamespaces: [],
      }).message
    ).toBe('[object Object]');
    expect(
      new WalletConnectionAttemptError({
        errors: [undefined],
        requestedNamespaces: [],
      }).message
    ).toBe('undefined');
  });

  it('prefer a message passed in over the first entry', () => {
    const error = new WalletConnectionAttemptError({
      errors: [new Error('first')],
      requestedNamespaces: [],
      message: 'Wallet connection still pending after 3 minutes',
    });

    expect(error.message).toBe(
      'Wallet connection still pending after 3 minutes'
    );
  });

  it('have an empty message with no entries and no message passed in', () => {
    const error = new WalletConnectionAttemptError({
      errors: [],
      requestedNamespaces: [],
    });

    expect(error.message).toBe('');
  });

  it('have its own name instead of the aggregate error name', () => {
    const error = new WalletConnectionAttemptError({
      errors: [rejection()],
      requestedNamespaces: [],
    });

    expect(error.name).toBe('WalletConnectionAttemptError');
  });

  it('have no code even when an entry has one', () => {
    const error = new WalletConnectionAttemptError({
      errors: [rejection()],
      requestedNamespaces: [],
    });

    expect(error).not.toHaveProperty('code');
  });

  it('have no cause even when it has an entry', () => {
    const error = new WalletConnectionAttemptError({
      errors: [rejection()],
      requestedNamespaces: [],
    });

    expect(error).not.toHaveProperty('cause');
  });
});

describe('AutoConnectionAttemptError', () => {
  it('extend the wallet connection attempt error with its own name', () => {
    const entry = new Error('EVM failed');

    const error = new AutoConnectionAttemptError({
      errors: [entry],
      requestedNamespaces: [{ namespace: 'EVM', network: 'ETH' }],
    });

    expect(error).toBeInstanceOf(WalletConnectionAttemptError);
    expect(error.name).toBe('AutoConnectionAttemptError');
    expect(error.message).toBe('EVM failed');
    expect(error.errors).toEqual([entry]);
    expect(error.requestedNamespaces).toEqual([
      { namespace: 'EVM', network: 'ETH' },
    ]);
  });
});

describe('buildConnectionAttemptError', () => {
  it('list every failed namespace in request order', () => {
    const evmError = new WalletConnectionError({
      namespace: 'EVM',
      cause: new Error('EVM failed'),
    });
    const suiError = new WalletConnectionError({
      namespace: 'Sui',
      cause: new Error('Sui failed'),
    });

    const error = buildConnectionAttemptError({
      requestedNamespaces,
      attempts: [
        { input: evm, result: new Err(evmError) },
        { input: solana, result: connected },
        { input: sui, result: new Err(suiError) },
      ],
      nonNamespaceError: None,
    });

    expect(error).toBeInstanceOf(WalletConnectionAttemptError);
    expect(error?.errors).toEqual([evmError, suiError]);
    expect(error?.errors[0]).toBe(evmError);
    expect(error?.errors[1]).toBe(suiError);
    expect(error?.message).toBe('EVM failed');
  });

  it('leave namespaces marked as cancelled out of errors', () => {
    const rejectionError = rejection();

    const error = buildConnectionAttemptError({
      requestedNamespaces,
      attempts: [
        { input: evm, result: new Err(rejectionError) },
        { input: solana, result: new Err(rejectionError), cancelled: true },
        { input: sui, result: new Err(rejectionError), cancelled: true },
      ],
      nonNamespaceError: None,
    });

    expect(error?.errors).toHaveLength(1);
    expect(error?.errors[0]).toMatchObject({ namespace: 'EVM' });
  });

  it('keep a failure that shares its error object with an earlier one when it is not cancelled', () => {
    const sharedError = new Error('Wallet is not available');

    const error = buildConnectionAttemptError({
      requestedNamespaces,
      attempts: [
        { input: evm, result: new Err(sharedError) },
        { input: solana, result: new Err(sharedError) },
      ],
      nonNamespaceError: None,
    });

    expect(error?.errors).toHaveLength(2);
    expect(error?.errors[0]).toMatchObject({ namespace: 'EVM' });
    expect(error?.errors[1]).toMatchObject({ namespace: 'Solana' });
  });

  it('wrap a failure that is not a wallet connection error in one for its namespace', () => {
    const error = buildConnectionAttemptError({
      requestedNamespaces,
      attempts: [{ input: solana, result: new Err(rejection()) }],
      nonNamespaceError: None,
    });

    const [entry] = error?.errors ?? [];
    expect(entry).toBeInstanceOf(WalletConnectionError);
    expect(entry).toMatchObject({
      name: 'WalletConnectionError',
      namespace: 'Solana',
      message: 'User rejected the request.',
    });
  });

  it('keep the raw failure as the cause of its wrapper and copy its code', () => {
    const rawError = rejection();

    const error = buildConnectionAttemptError({
      requestedNamespaces,
      attempts: [{ input: solana, result: new Err(rawError) }],
      nonNamespaceError: None,
    });

    const [entry] = error?.errors ?? [];
    expect((entry as WalletConnectionError).cause).toBe(rawError);
    expect(entry).toMatchObject({ code: USER_REJECTION_ERROR_CODE });
  });

  it('wrap a thrown value that is not an error object for its namespace', () => {
    const error = buildConnectionAttemptError({
      requestedNamespaces,
      attempts: [{ input: evm, result: new Err('User closed the popup') }],
      nonNamespaceError: None,
    });

    const [entry] = error?.errors ?? [];
    expect(entry).toBeInstanceOf(WalletConnectionError);
    expect(entry).toMatchObject({
      namespace: 'EVM',
      message: 'User closed the popup',
    });
    expect((entry as WalletConnectionError).cause).toBe(
      'User closed the popup'
    );
  });

  it('add a value thrown outside any namespace after the namespace failures unchanged', () => {
    const storageError = new Error('QuotaExceededError');

    const error = buildConnectionAttemptError({
      requestedNamespaces,
      attempts: [
        { input: evm, result: new Err(new Error('EVM failed')) },
        { input: solana, result: connected },
      ],
      nonNamespaceError: new Some(storageError),
    });

    expect(error?.errors).toHaveLength(2);
    expect(error?.errors[0]).toMatchObject({ namespace: 'EVM' });
    expect(error?.errors[1]).toBe(storageError);
  });

  it('add a thrown undefined as an entry', () => {
    const error = buildConnectionAttemptError({
      requestedNamespaces,
      attempts: [],
      nonNamespaceError: new Some(undefined),
    });

    expect(error).toBeInstanceOf(WalletConnectionAttemptError);
    expect(error?.errors).toEqual([undefined]);
  });

  it('return nothing when every namespace connected', () => {
    expect(
      buildConnectionAttemptError({
        requestedNamespaces,
        attempts: [
          { input: evm, result: connected },
          { input: solana, result: connected },
        ],
        nonNamespaceError: None,
      })
    ).toBeUndefined();
  });

  it('return an error with no entries when every namespace that did not connect was cancelled', () => {
    const error = buildConnectionAttemptError({
      requestedNamespaces,
      attempts: [{ input: evm, result: new Err(rejection()), cancelled: true }],
      nonNamespaceError: None,
    });

    expect(error).toBeInstanceOf(WalletConnectionAttemptError);
    expect(error?.errors).toEqual([]);
  });
});

describe('buildAutoConnectionAttemptError', () => {
  it('return nothing when every attempted namespace connected', () => {
    expect(
      buildAutoConnectionAttemptError([
        { input: evm, result: connected },
        { input: sui, result: connected },
      ])
    ).toBeUndefined();
  });

  it('list the attempted namespaces with their networks', () => {
    const error = buildAutoConnectionAttemptError([
      { input: evm, result: connected },
      { input: sui, result: new Err(new Error('Sui failed')) },
    ]);

    expect(error).toBeInstanceOf(AutoConnectionAttemptError);
    expect(error?.requestedNamespaces).toEqual([
      { namespace: 'EVM', network: 'ETH' },
      { namespace: 'Sui', network: undefined },
    ]);
  });

  it('wrap each failure in a wallet connection error for its namespace', () => {
    const rawError = new Error('Sui failed');

    const error = buildAutoConnectionAttemptError([
      { input: evm, result: connected },
      { input: sui, result: new Err(rawError) },
    ]);

    expect(error?.errors).toHaveLength(1);
    expect(error?.errors[0]).toBeInstanceOf(WalletConnectionError);
    expect(error?.errors[0]).toMatchObject({
      namespace: 'Sui',
      cause: rawError,
    });
  });
});
