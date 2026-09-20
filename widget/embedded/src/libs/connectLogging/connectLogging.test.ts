import type {
  ConnectionAttempt,
  ConnectLogEvent,
} from './connectLogging.types';
import type { WalletErrorCode } from '@hub3js/std/utils';
import type {
  ConnectResult,
  NamespaceInputForConnect,
} from '@rango-dev/wallets-react';

import {
  USER_REJECTION_ERROR_CODE,
  WALLET_LOCKED_ERROR_CODE,
  WalletConnectionError,
} from '@hub3js/std/utils';
import { error as logError, warn as logWarn } from '@rango-dev/logging-core';
import {
  AutoConnectionAttemptError,
  WalletConnectionAttemptError,
} from '@rango-dev/wallets-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { logAutoConnectFailure, runConnectWithLogging } from './connectLogging';

vi.mock('@rango-dev/logging-core', () => ({ error: vi.fn(), warn: vi.fn() }));

const loggedError = vi.mocked(logError);
const loggedWarn = vi.mocked(logWarn);

const THREE_MINUTES = 180_000;

const REQUEST_ALREADY_PENDING_CODE = -32002;
const PROVIDER_INTERNAL_ERROR_CODE = -32603;

/** A thrown value that is neither an object nor a string. */
const THROWN_NUMBER = 42;

const REQUESTED: NamespaceInputForConnect[] = [
  { namespace: 'EVM', network: undefined },
  { namespace: 'Solana', network: undefined },
];

const ATTEMPT: ConnectionAttempt = {
  walletType: 'phantom',
  trigger: 'wallets-page',
  requestedNamespaces: REQUESTED,
};

const CONNECTED: ConnectResult[] = [{ accounts: [], network: null }];

function errorWithCode(message: string, code: WalletErrorCode): Error {
  return Object.assign(new Error(message), { code });
}

function failure(namespace: string, cause: unknown): WalletConnectionError {
  return new WalletConnectionError({ namespace, cause });
}

function rejection(namespace: string): WalletConnectionError {
  return failure(
    namespace,
    errorWithCode('User rejected the request.', USER_REJECTION_ERROR_CODE)
  );
}

function locked(namespace: string): WalletConnectionError {
  return failure(
    namespace,
    errorWithCode('Please unlock your wallet.', WALLET_LOCKED_ERROR_CODE)
  );
}

function chunkLoadFailure(): Error {
  return new TypeError(
    'Failed to fetch dynamically imported module: https://cdn.example/solana.js'
  );
}

function attemptError(
  errors: unknown[],
  requestedNamespaces: NamespaceInputForConnect[] = REQUESTED
): WalletConnectionAttemptError {
  return new WalletConnectionAttemptError({ errors, requestedNamespaces });
}

/** A `WalletConnectionError` from another copy of `@hub3js/std`. */
class ForeignWalletConnectionError extends Error {
  name = 'WalletConnectionError';
  constructor(
    readonly namespace: string,
    message: string,
    readonly code?: WalletErrorCode
  ) {
    super(message);
  }
}

/** An error that throws the moment anything reads the given field. */
function withUnreadable<Value extends object>(
  value: Value,
  field: string
): Value {
  Object.defineProperty(value, field, {
    get: () => {
      throw new Error(`This ${field} cannot be read.`);
    },
  });

  return value;
}

/** A value that throws the moment anything reads anything from it. */
function unreadable(): unknown {
  return new Proxy(
    {},
    {
      get: () => {
        throw new Error('Nothing can be read from this value.');
      },
      getPrototypeOf: () => {
        throw new Error('Nothing can be read from this value.');
      },
    }
  );
}

/** What the logger was given, or `null` when it was given nothing. */
function loggedEvent(): ConnectLogEvent | null {
  const call = loggedError.mock.calls[0];

  return call
    ? ({
        error: call[0],
        tags: call[1]?.tags,
        context: call[1]?.context,
      } as ConnectLogEvent)
    : null;
}

/** The event logged for an attempt that fails with `thrown`. */
async function eventFor(
  thrown: unknown,
  attempt: ConnectionAttempt = ATTEMPT
): Promise<ConnectLogEvent | null> {
  loggedError.mockClear();
  await expect(
    runConnectWithLogging(attempt, async () => Promise.reject(thrown))
  ).rejects.toBe(thrown);

  return loggedEvent();
}

/** The event the timer logs for an attempt that never settles. Needs fake timers. */
function timeoutEventFor(
  attempt: ConnectionAttempt = ATTEMPT
): ConnectLogEvent | null {
  loggedError.mockClear();
  void runConnectWithLogging(
    attempt,
    async () => new Promise<ConnectResult[]>(() => undefined)
  );
  vi.advanceTimersByTime(THREE_MINUTES);

  return loggedEvent();
}

beforeEach(() => {
  loggedError.mockReset();
  loggedWarn.mockReset();
});

describe('classifying one connection failure of an attempt', () => {
  it('sets aside a wallet connection error with the rejection code', async () => {
    expect(await eventFor(attemptError([rejection('EVM')]))).toBeNull();
  });

  it('sets aside a wallet connection error with the locked code', async () => {
    expect(await eventFor(attemptError([locked('Tron')]))).toBeNull();
  });

  it('matches the rejection code strictly, so one sent as a string is logged', async () => {
    const event = await eventFor(
      attemptError([
        new ForeignWalletConnectionError(
          'EVM',
          'User rejected.',
          String(USER_REJECTION_ERROR_CODE)
        ),
      ])
    );

    expect(event?.tags.category).toBe('wallet');
  });

  it('logs a wallet connection error caused by a chunk that failed to load as wallet', async () => {
    const event = await eventFor(
      attemptError([failure('Solana', chunkLoadFailure())])
    );

    expect(event?.tags.category).toBe('wallet');
  });

  it('classifies any other wallet connection error as wallet', async () => {
    expect(
      (await eventFor(attemptError([failure('Solana', new Error('boom'))])))
        ?.tags.category
    ).toBe('wallet');
    expect(
      (
        await eventFor(
          attemptError([
            failure(
              'EVM',
              errorWithCode(
                'Request already pending.',
                REQUEST_ALREADY_PENDING_CODE
              )
            ),
          ])
        )
      )?.tags.category
    ).toBe('wallet');
    expect(
      (
        await eventFor(
          attemptError([
            failure(
              'Solana',
              new Error('No accounts were returned by the provider')
            ),
          ])
        )
      )?.tags.category
    ).toBe('wallet');
  });

  it('classifies a failure that is not a wallet connection error as unknown', async () => {
    expect(
      (await eventFor(attemptError([new Error('Wallet is not registered.')])))
        ?.tags.category
    ).toBe('unknown');
    expect(
      (await eventFor(attemptError(['connection closed'])))?.tags.category
    ).toBe('unknown');
  });

  it('classifies a failure that is itself a chunk that failed to load as unknown', async () => {
    expect(
      (await eventFor(attemptError([chunkLoadFailure()])))?.tags.category
    ).toBe('unknown');
  });

  it('reads the code from the failure, not from its cause', async () => {
    const walletFailure = new ForeignWalletConnectionError('EVM', 'boom');
    Object.assign(walletFailure, {
      cause: errorWithCode('User rejected.', USER_REJECTION_ERROR_CODE),
    });

    expect((await eventFor(attemptError([walletFailure])))?.tags.category).toBe(
      'wallet'
    );
  });

  it('recognizes a wallet connection error from another copy of the package by its name', async () => {
    const foreign = new ForeignWalletConnectionError('Solana', 'boom');

    expect(foreign).not.toBeInstanceOf(WalletConnectionError);
    expect((await eventFor(attemptError([foreign])))?.tags.category).toBe(
      'wallet'
    );
    expect(
      await eventFor(
        attemptError([
          new ForeignWalletConnectionError(
            'EVM',
            'User rejected.',
            USER_REJECTION_ERROR_CODE
          ),
        ])
      )
    ).toBeNull();
  });
});

describe('resolving the category of a failed attempt', () => {
  it('builds no event when every failure is a rejection or a locked wallet', async () => {
    expect(
      await eventFor(attemptError([rejection('EVM'), locked('Solana')]))
    ).toBeNull();
  });

  it('resolves to wallet when only wallet connection errors are logged, uncoded or pending ones included', async () => {
    const event = await eventFor(
      attemptError([
        failure('EVM', new Error('boom')),
        failure(
          'Solana',
          errorWithCode(
            'Request already pending.',
            REQUEST_ALREADY_PENDING_CODE
          )
        ),
      ])
    );

    expect(event?.tags.category).toBe('wallet');
  });

  it('resolves to unknown when any logged failure is not a wallet connection error', async () => {
    const event = await eventFor(
      attemptError([failure('EVM', new Error('boom')), new Error('bug')])
    );

    expect(event?.tags.category).toBe('unknown');
  });

  it('logs an attempt whose failures all failed to load a chunk', async () => {
    const event = await eventFor(
      attemptError([failure('UTXO', chunkLoadFailure()), chunkLoadFailure()])
    );

    expect(event?.tags.category).toBe('unknown');
  });

  it('logs an attempt that mixes ignored and logged failures', async () => {
    const event = await eventFor(
      attemptError([rejection('EVM'), failure('Solana', new Error('boom'))])
    );

    expect(event?.tags.category).toBe('wallet');
  });

  it('treats a value that is not an attempt error as an attempt with that value as its only failure', async () => {
    const configError = new Error('Wallet is not registered.');
    const event = await eventFor(configError);

    expect(event?.tags.category).toBe('unknown');
    expect(event?.context.failures).toEqual([
      { name: 'Error', message: 'Wallet is not registered.' },
    ]);
    expect((await eventFor(chunkLoadFailure()))?.tags.category).toBe('unknown');
    expect(await eventFor(rejection('EVM'))).toBeNull();
  });

  it('recognizes an attempt error from another copy of the package by its name', async () => {
    const foreign = Object.assign(
      new AggregateError([failure('Solana', new Error('boom'))], 'boom'),
      { name: 'WalletConnectionAttemptError', requestedNamespaces: REQUESTED }
    );

    const event = await eventFor(foreign);

    expect(event?.tags.category).toBe('wallet');
    expect(event?.tags.namespaces).toBe('Solana');
  });
});

describe('choosing the error to log', () => {
  it('logs the received attempt error itself, unchanged', async () => {
    const failures = [rejection('EVM'), failure('Solana', new Error('boom'))];
    const received = attemptError(failures);

    const event = await eventFor(received);

    expect(event?.error).toBe(received);
    expect(received.errors).toEqual(failures);
    expect(received.message).toBe('User rejected the request.');
  });

  it('logs a received value that is not an error as an attempt error holding it', async () => {
    const event = await eventFor('connection closed');

    expect(event?.error).toBeInstanceOf(WalletConnectionAttemptError);
    expect((event?.error as WalletConnectionAttemptError).errors).toEqual([
      'connection closed',
    ]);
    expect(event?.error.message).toBe('connection closed');
  });
});

describe('tagging a failed attempt', () => {
  it('lists only the namespaces of the logged wallet connection errors, sorted', async () => {
    const event = await eventFor(
      attemptError(
        [
          failure('Solana', new Error('boom')),
          rejection('UTXO'),
          failure('EVM', new Error('bang')),
        ],
        [...REQUESTED, { namespace: 'UTXO', network: undefined }]
      )
    );

    expect(event?.tags.namespaces).toBe('EVM,Solana');
  });

  it('lists a namespace and a network asked for or blamed twice only once', async () => {
    const event = await eventFor(
      attemptError(
        [failure('EVM', new Error('boom')), failure('EVM', new Error('bang'))],
        [
          { namespace: 'EVM', network: 'POLYGON' },
          { namespace: 'EVM', network: 'POLYGON' },
        ]
      )
    );

    expect(event?.tags.namespaces).toBe('EVM');
    expect(event?.tags.network).toBe('POLYGON');
  });

  it('falls back to the requested namespaces for an unknown event', async () => {
    const event = await eventFor(
      attemptError([failure('Solana', new Error('boom')), new Error('bug')])
    );

    expect(event?.tags.namespaces).toBe('EVM,Solana');
  });

  it('takes the network the attempt requested for each tagged namespace', async () => {
    const event = await eventFor(
      attemptError(
        [failure('EVM', new Error('boom'))],
        [
          { namespace: 'EVM', network: 'POLYGON' },
          { namespace: 'Solana', network: 'SOLANA' },
        ]
      )
    );

    expect(event?.tags.network).toBe('POLYGON');
  });

  it('sorts the networks of every requested namespace when no namespace can be blamed', async () => {
    const event = await eventFor(
      attemptError(
        [new Error('bug')],
        [
          { namespace: 'Solana', network: 'SOLANA' },
          { namespace: 'EVM', network: 'BSC' },
        ]
      )
    );

    expect(event?.tags.network).toBe('BSC,SOLANA');
  });

  it('omits the network tag when no network was requested, an empty string included', async () => {
    const event = await eventFor(
      attemptError(
        [failure('EVM', new Error('boom'))],
        [{ namespace: 'EVM', network: '' }]
      )
    );

    expect(event?.tags).not.toHaveProperty('network');
  });

  it('omits the namespaces tag when there are none', async () => {
    const event = await eventFor(new Error('boom'), {
      ...ATTEMPT,
      requestedNamespaces: [],
    });

    expect(event?.tags).not.toHaveProperty('namespaces');
  });

  it('tags the wallet, the namespaces, the network, the trigger and the category, and nothing else', async () => {
    const event = await eventFor(
      attemptError(
        [failure('EVM', new Error('boom'))],
        [{ namespace: 'EVM', network: 'POLYGON' }]
      )
    );

    expect(event?.tags).toEqual({
      walletType: 'phantom',
      namespaces: 'EVM',
      network: 'POLYGON',
      trigger: 'wallets-page',
      category: 'wallet',
    });
  });
});

describe('describing a failed attempt', () => {
  it('describes every failure of the attempt, the ignored ones included', async () => {
    const event = await eventFor(
      attemptError([
        rejection('EVM'),
        failure(
          'Solana',
          errorWithCode(
            'Provider is unavailable.',
            PROVIDER_INTERNAL_ERROR_CODE
          )
        ),
        new Error('bug'),
      ])
    );

    expect(event?.context.failures).toEqual([
      {
        namespace: 'EVM',
        name: 'WalletConnectionError',
        message: 'User rejected the request.',
        code: USER_REJECTION_ERROR_CODE,
      },
      {
        namespace: 'Solana',
        name: 'WalletConnectionError',
        message: 'Provider is unavailable.',
        code: PROVIDER_INTERNAL_ERROR_CODE,
      },
      { name: 'Error', message: 'bug' },
    ]);
  });

  it('lists the requested namespaces in request order', async () => {
    const requested: NamespaceInputForConnect[] = [
      { namespace: 'Solana', network: undefined },
      { namespace: 'EVM', network: undefined },
    ];

    expect(
      (await eventFor(attemptError([new Error('bug')], requested)))?.context
        .requestedNamespaces
    ).toEqual(['Solana', 'EVM']);
  });

  it('keeps the requested namespaces present when there are none', async () => {
    const event = await eventFor(new Error('boom'), {
      ...ATTEMPT,
      requestedNamespaces: [],
    });

    expect(event?.context.requestedNamespaces).toEqual([]);
  });

  it('describes failures only by namespace, name, message and code, never by accounts', async () => {
    const cause = Object.assign(new Error('boom'), {
      accounts: ['eip155:1:0x1234567890abcdef'],
      address: '0x1234567890abcdef',
    });

    const event = await eventFor(attemptError([failure('EVM', cause)]));

    expect(event?.context).toEqual({
      failures: [
        { namespace: 'EVM', name: 'WalletConnectionError', message: 'boom' },
      ],
      requestedNamespaces: ['EVM', 'Solana'],
    });
  });
});

describe('logging an attempt with a failure that cannot be read', () => {
  it('logs a failure whose name cannot be read as unknown', async () => {
    const unreadableName = withUnreadable(
      new Error('Provider is unavailable.'),
      'name'
    );

    const event = await eventFor(attemptError([unreadableName]));

    expect(event?.tags.category).toBe('unknown');
    expect(event?.context.failures).toEqual([
      { name: '(unreadable)', message: 'Provider is unavailable.' },
    ]);
  });

  it('logs a wallet connection error whose code or cause cannot be read', async () => {
    const unreadableCode = withUnreadable(
      new ForeignWalletConnectionError('EVM', 'boom'),
      'code'
    );
    const unreadableCause = withUnreadable(
      new ForeignWalletConnectionError('Solana', 'bang'),
      'cause'
    );

    const event = await eventFor(
      attemptError([unreadableCode, unreadableCause])
    );

    expect(event?.tags.category).toBe('wallet');
    expect(event?.tags.namespaces).toBe('EVM,Solana');
    expect(event?.context.failures).toEqual([
      { namespace: 'EVM', name: 'WalletConnectionError', message: 'boom' },
      { namespace: 'Solana', name: 'WalletConnectionError', message: 'bang' },
    ]);
  });

  it('stands in for a message that cannot be read', async () => {
    const unreadableMessage = withUnreadable(
      new ForeignWalletConnectionError(
        'EVM',
        'boom',
        PROVIDER_INTERNAL_ERROR_CODE
      ),
      'message'
    );
    const received = new WalletConnectionAttemptError({
      errors: [unreadableMessage],
      requestedNamespaces: REQUESTED,
      message: 'boom',
    });

    expect((await eventFor(received))?.context.failures).toEqual([
      {
        namespace: 'EVM',
        name: 'WalletConnectionError',
        message: 'Failure could not be described',
        code: PROVIDER_INTERNAL_ERROR_CODE,
      },
    ]);
  });

  it('leaves a namespace that cannot be read out of the failure and the tags', async () => {
    const unreadableNamespace = withUnreadable(
      new ForeignWalletConnectionError('EVM', 'boom'),
      'namespace'
    );

    const event = await eventFor(
      attemptError([unreadableNamespace, failure('Solana', new Error('bang'))])
    );

    expect(event?.tags.namespaces).toBe('Solana');
    expect(event?.context.failures[0]).toEqual({
      name: 'WalletConnectionError',
      message: 'boom',
    });
  });

  it('carries only the two stand-ins for a failure nothing can be read from', async () => {
    const event = await eventFor(
      attemptError([failure('Solana', new Error('boom')), unreadable()])
    );

    expect(event?.tags.category).toBe('unknown');
    expect(event?.context.failures[1]).toEqual({
      name: '(unreadable)',
      message: 'Failure could not be described',
    });
  });

  it('carries only the two stand-ins for a failure that is not an object', async () => {
    const event = await eventFor(
      attemptError(['connection closed', THROWN_NUMBER])
    );

    expect(event?.context.failures).toEqual([
      { name: '(unreadable)', message: 'Failure could not be described' },
      { name: '(unreadable)', message: 'Failure could not be described' },
    ]);
  });

  it('stands in for a missing message instead of stringifying the failure', async () => {
    const plainFailure = {
      name: 'ProviderError',
      accounts: ['eip155:1:0x1234567890abcdef'],
      toString: () => 'connection failed for 0x1234567890abcdef',
    };

    expect(
      (await eventFor(attemptError([plainFailure])))?.context.failures
    ).toEqual([
      { name: 'ProviderError', message: 'Failure could not be described' },
    ]);
  });

  it('leaves tag values that cannot be read or are not strings out of the tags', async () => {
    const requested = [
      { namespace: 'EVM', network: Symbol('POLYGON') },
      withUnreadable({ namespace: 'Solana', network: 'SOLANA' }, 'network'),
      withUnreadable({ namespace: 'UTXO', network: 'BTC' }, 'namespace'),
      { namespace: 'Tron', network: 'TRON' },
    ] as unknown as NamespaceInputForConnect[];

    const event = await eventFor(attemptError([new Error('bug')], requested));

    expect(event?.tags.namespaces).toBe('EVM,Solana,Tron');
    expect(event?.tags.network).toBe('TRON');
  });
});

describe('sending the event', () => {
  it('logs every category at error level with its tags and context', async () => {
    const received = attemptError([failure('Solana', new Error('boom'))]);
    const bug = new Error('bug');

    await expect(
      runConnectWithLogging(ATTEMPT, async () => Promise.reject(received))
    ).rejects.toBe(received);
    await expect(
      runConnectWithLogging(ATTEMPT, async () => Promise.reject(bug))
    ).rejects.toBe(bug);

    expect(loggedWarn).not.toHaveBeenCalled();
    expect(loggedError).toHaveBeenCalledTimes(2);
    expect(loggedError.mock.calls[0]).toEqual([
      received,
      {
        tags: {
          walletType: 'phantom',
          namespaces: 'Solana',
          trigger: 'wallets-page',
          category: 'wallet',
        },
        context: {
          failures: [
            {
              namespace: 'Solana',
              name: 'WalletConnectionError',
              message: 'boom',
            },
          ],
          requestedNamespaces: ['EVM', 'Solana'],
        },
      },
    ]);
    expect(loggedError.mock.calls[1]?.[1]?.tags).toEqual(
      expect.objectContaining({ category: 'unknown' })
    );
  });

  it('sends nothing for an attempt with no logged failures', async () => {
    const ignored = attemptError([rejection('EVM')]);

    await expect(
      runConnectWithLogging(ATTEMPT, async () => Promise.reject(ignored))
    ).rejects.toBe(ignored);

    expect(loggedError).not.toHaveBeenCalled();
  });

  it('drops an event it cannot send, without throwing', async () => {
    loggedError.mockImplementationOnce(() => {
      throw new Error('The logger is not ready.');
    });
    const bug = new Error('bug');

    await expect(
      runConnectWithLogging(ATTEMPT, async () => Promise.reject(bug))
    ).rejects.toBe(bug);
  });
});

describe('logging an auto-connect failure', () => {
  it('logs the auto-connection attempt error unchanged with the auto-connect trigger', () => {
    const received = new AutoConnectionAttemptError({
      errors: [failure('EVM', new Error('boom'))],
      requestedNamespaces: [
        { namespace: 'EVM', network: 'POLYGON' },
        { namespace: 'Solana', network: undefined },
      ],
    });

    logAutoConnectFailure('metamask', received);

    expect(loggedError).toHaveBeenCalledTimes(1);
    expect(loggedError.mock.calls[0]?.[0]).toBe(received);
    expect(loggedError.mock.calls[0]?.[1]).toEqual({
      tags: {
        walletType: 'metamask',
        namespaces: 'EVM',
        network: 'POLYGON',
        trigger: 'auto-connect',
        category: 'wallet',
      },
      context: {
        failures: [
          { namespace: 'EVM', name: 'WalletConnectionError', message: 'boom' },
        ],
        requestedNamespaces: ['EVM', 'Solana'],
      },
    });
  });

  it('logs nothing when every failure was rejected or locked', () => {
    logAutoConnectFailure(
      'metamask',
      new AutoConnectionAttemptError({
        errors: [rejection('EVM'), locked('Solana')],
        requestedNamespaces: REQUESTED,
      })
    );

    expect(loggedError).not.toHaveBeenCalled();
  });
});

describe('running a connection attempt', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('logs one timeout event when the attempt is still pending after three minutes', async () => {
    let settle: (() => void) | undefined;
    const attempt = runConnectWithLogging(
      ATTEMPT,
      async () =>
        new Promise<ConnectResult[]>((resolve) => {
          settle = () => resolve(CONNECTED);
        })
    );

    vi.advanceTimersByTime(THREE_MINUTES);

    expect(loggedError).toHaveBeenCalledTimes(1);
    expect(loggedError.mock.calls[0]?.[0].message).toBe(
      'Wallet connection still pending after 3 minutes'
    );
    expect(loggedError.mock.calls[0]?.[1]?.tags).toEqual({
      walletType: 'phantom',
      namespaces: 'EVM,Solana',
      trigger: 'wallets-page',
      category: 'timeout',
    });

    settle?.();
    await expect(attempt).resolves.toBe(CONNECTED);

    vi.advanceTimersByTime(THREE_MINUTES);
    expect(loggedError).toHaveBeenCalledTimes(1);
  });

  it('logs a timeout error with no failures, how long the attempt waited and the requested namespaces with their networks', () => {
    const event = timeoutEventFor({
      ...ATTEMPT,
      requestedNamespaces: [
        { namespace: 'EVM', network: 'POLYGON', derivationPath: "44'/60'/0'" },
        { namespace: 'Solana', network: undefined },
      ],
    });
    const error = event?.error as WalletConnectionAttemptError;

    expect(error).toBeInstanceOf(WalletConnectionAttemptError);
    expect(error.errors).toEqual([]);
    expect(error.message).toBe(
      'Wallet connection still pending after 3 minutes'
    );
    expect(error.requestedNamespaces).toEqual([
      { namespace: 'EVM', network: 'POLYGON' },
      { namespace: 'Solana', network: undefined },
    ]);
  });

  it('describes a timeout with no failures and the requested namespaces', () => {
    expect(timeoutEventFor()?.context).toEqual({
      failures: [],
      requestedNamespaces: ['EVM', 'Solana'],
    });
  });

  it('logs nothing when the attempt settles within three minutes', async () => {
    await expect(
      runConnectWithLogging(ATTEMPT, async () => CONNECTED)
    ).resolves.toBe(CONNECTED);

    vi.advanceTimersByTime(THREE_MINUTES);

    expect(loggedError).not.toHaveBeenCalled();
  });

  it('logs a failure that arrives after the timeout as its own event', async () => {
    let fail: ((reason: unknown) => void) | undefined;
    const received = attemptError([failure('Solana', new Error('boom'))]);
    const attempt = runConnectWithLogging(
      ATTEMPT,
      async () =>
        new Promise<ConnectResult[]>((_, reject) => {
          fail = reject;
        })
    );

    vi.advanceTimersByTime(THREE_MINUTES);
    fail?.(received);

    await expect(attempt).rejects.toBe(received);
    expect(loggedError.mock.calls.map(([, data]) => data?.tags)).toEqual([
      expect.objectContaining({ category: 'timeout' }),
      expect.objectContaining({ category: 'wallet' }),
    ]);
    expect(loggedError.mock.calls[1]?.[0]).toBe(received);
  });

  it('lets no throw escape the timer when the timeout event cannot be sent', () => {
    loggedError.mockImplementationOnce(() => {
      throw new Error('The logger is not ready.');
    });

    void runConnectWithLogging(
      ATTEMPT,
      async () => new Promise<ConnectResult[]>(() => undefined)
    );

    expect(() => vi.advanceTimersByTime(THREE_MINUTES)).not.toThrow();
  });

  it('rethrows what connect threw, unchanged, whether it was logged or not', async () => {
    const ignored = attemptError([rejection('EVM')]);
    const logged = attemptError([failure('EVM', new Error('boom'))]);

    await expect(
      runConnectWithLogging(ATTEMPT, async () => Promise.reject(ignored))
    ).rejects.toBe(ignored);
    await expect(
      runConnectWithLogging(ATTEMPT, async () => Promise.reject(logged))
    ).rejects.toBe(logged);
    expect(loggedError).toHaveBeenCalledTimes(1);
  });
});
