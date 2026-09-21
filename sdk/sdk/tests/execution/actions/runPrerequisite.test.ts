import type { SwapExecution } from '../../../src/execution/types';
import type { FakeProviderOptions } from '../fakes';
import type {
  StellarChangeTrustLinePrerequisite,
  StellarTransaction,
  TransactionPrerequisite,
  TransactionPrerequisiteResult,
  XrplChangeTrustLinePrerequisite,
  XrplTransaction,
} from 'rango-types';

import { Operation, xdr } from '@stellar/stellar-sdk';
import {
  SignerError,
  SignerErrorCode,
  STELLAR_CHANGE_TRUSTLINE_TYPE,
  TransactionType,
  XRPL_CHANGE_TRUSTLINE_TYPE,
} from 'rango-types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { runPrerequisite } from '../../../src/execution/actions/runPrerequisite/runPrerequisite';
import {
  account,
  blocked,
  CHAIN_IDS,
  contextFor,
  execution,
  failure,
  fakeNamespace,
  fakeProvider,
  fakeSigner,
  transaction,
} from '../fakes';

const xrplClient = vi.hoisted(() => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  request: vi.fn(),
}));

vi.mock('xrpl', () => ({
  Client: class {
    connect = xrplClient.connect;
    disconnect = xrplClient.disconnect;
    request = xrplClient.request;
  },
}));

const XRPL_INFINITE = '10000000000000';
const STELLAR_INFINITE = '922337203685.4775807';
const STELLAR_ISSUER =
  'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';

const xrplPrerequisite: XrplChangeTrustLinePrerequisite = {
  type: XRPL_CHANGE_TRUSTLINE_TYPE,
  blockChain: 'XRPL',
  currency: 'USD',
  issuer: 'rISSUER',
  value: '10',
  wallet: 'rWALLET',
};

const stellarPrerequisite: StellarChangeTrustLinePrerequisite = {
  type: STELLAR_CHANGE_TRUSTLINE_TYPE,
  blockChain: 'STELLAR',
  code: 'USDC',
  issuer: STELLAR_ISSUER,
  value: '10',
  wallet: 'GWALLET',
};

const xrplTx = transaction([xrplPrerequisite]);
const stellarTx = transaction([stellarPrerequisite]);

const params = { stepIndex: 0, prerequisiteIndex: 0 };
const failed = (code: string) => failure(code, 'run_prerequisites');

function xrplProvider(
  accountLines = vi.fn(),
  signer: FakeProviderOptions['signer'] = fakeSigner()
) {
  return fakeProvider({ namespaces: { xrpl: { accountLines } }, signer });
}

function stellarProvider(
  balanceLines = vi.fn(),
  signer: FakeProviderOptions['signer'] = fakeSigner()
) {
  return fakeProvider({ namespaces: { stellar: { balanceLines } }, signer });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('runPrerequisite', () => {
  it('fails the swap when the step has no prerequisite at that index', async () => {
    const exec = execution(transaction([]));

    const transitions = await runPrerequisite(
      exec,
      contextFor(fakeProvider()),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
  });

  it('fails the swap on a prerequisite type it does not know', async () => {
    const unknown = {
      type: 'NEW_PREREQUISITE',
    } as unknown as TransactionPrerequisite;
    const exec = execution(transaction([unknown]));

    const transitions = await runPrerequisite(
      exec,
      contextFor(fakeProvider()),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
  });

  it.each(['success', 'skipped', 'failed'] as const)(
    'fails the swap when asked to run a prerequisite that is already %s',
    async (status) => {
      const settled = {
        prerequisiteIndex: 0,
        prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
        status,
        data: status === 'skipped' ? null : { executedTransactionHash: 'H' },
      } as TransactionPrerequisiteResult;
      const exec = execution(xrplTx, [settled]);
      const accountLines = vi.fn();

      const transitions = await runPrerequisite(
        exec,
        contextFor(xrplProvider(accountLines)),
        params
      );

      expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
      expect(accountLines).not.toHaveBeenCalled();
    }
  );

  it('matches results by index and type rather than by position', async () => {
    const otherResult: TransactionPrerequisiteResult = {
      prerequisiteIndex: 1,
      prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
      status: 'success',
      data: { executedTransactionHash: 'OTHER' },
    };
    const exec = execution(xrplTx, [otherResult]);
    const accountLines = vi
      .fn()
      .mockResolvedValue([
        { currency: 'USD', account: 'rISSUER', limit: XRPL_INFINITE },
      ]);

    const transitions = await runPrerequisite(
      exec,
      contextFor(xrplProvider(accountLines)),
      params
    );

    expect(transitions).toMatchObject([
      {
        type: 'prerequisite_updated',
        result: { prerequisiteIndex: 0, status: 'skipped' },
      },
    ]);
  });
});

describe('XRPL trust line', () => {
  it('skips when a line to the issuer already has the full limit', async () => {
    const exec = execution(xrplTx);
    const accountLines = vi.fn().mockResolvedValue([
      { currency: 'EUR', account: 'rISSUER', limit: XRPL_INFINITE },
      { currency: 'USD', account: 'rISSUER', limit: XRPL_INFINITE },
    ]);
    const signAndSendTx = vi.fn();

    const transitions = await runPrerequisite(
      exec,
      contextFor(xrplProvider(accountLines, fakeSigner(signAndSendTx))),
      params
    );

    expect(accountLines).toHaveBeenCalledWith('rWALLET', { peer: 'rISSUER' });
    expect(transitions).toEqual([
      {
        type: 'prerequisite_updated',
        stepIndex: 0,
        result: {
          prerequisiteIndex: 0,
          prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
          status: 'skipped',
          data: null,
        },
      },
    ]);
    expect(signAndSendTx).not.toHaveBeenCalled();
  });

  it.each([
    ['no line', []],
    [
      'a line with a lower limit',
      [{ currency: 'USD', account: 'rISSUER', limit: '100' }],
    ],
    [
      'a line for another currency',
      [{ currency: 'EUR', account: 'rISSUER', limit: XRPL_INFINITE }],
    ],
  ])(
    'signs a TrustSet and records it as pending when there is %s',
    async (_, lines) => {
      const exec = execution(xrplTx);
      const signAndSendTx = vi.fn().mockResolvedValue({ hash: 'TXHASH' });

      const transitions = await runPrerequisite(
        exec,
        contextFor(
          xrplProvider(
            vi.fn().mockResolvedValue(lines),
            fakeSigner(signAndSendTx)
          )
        ),
        params
      );

      const expectedTx: XrplTransaction = {
        type: TransactionType.XRPL,
        blockChain: 'XRPL',
        prerequisites: [],
        data: {
          TransactionType: 'TrustSet',
          Account: 'rWALLET',
          LimitAmount: {
            currency: 'USD',
            issuer: 'rISSUER',
            value: XRPL_INFINITE,
          },
        },
      };
      expect(signAndSendTx).toHaveBeenCalledWith(
        expectedTx,
        'rWALLET',
        CHAIN_IDS.XRPL
      );
      expect(transitions).toEqual([
        {
          type: 'prerequisite_updated',
          stepIndex: 0,
          result: {
            prerequisiteIndex: 0,
            prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
            status: 'pending',
            data: { executedTransactionHash: 'TXHASH' },
          },
        },
      ]);
    }
  );

  it('reports unblocked first when a parked step gets through the guard', async () => {
    const parked = execution(xrplTx, [], {
      blocked: { reason: 'wallet_disconnected', walletType: 'gem' },
    });

    const transitions = await runPrerequisite(
      parked,
      contextFor(
        xrplProvider(
          vi.fn().mockResolvedValue([]),
          fakeSigner(vi.fn().mockResolvedValue({ hash: 'TXHASH' }))
        )
      ),
      params
    );

    expect(transitions).toMatchObject([
      { type: 'unblocked', stepIndex: 0 },
      { type: 'prerequisite_updated', result: { status: 'pending' } },
    ]);
  });

  it('parks the step before reading the lines when the wallet is disconnected', async () => {
    const accountLines = vi.fn();
    const signAndSendTx = vi.fn();

    const transitions = await runPrerequisite(
      execution(xrplTx),
      contextFor(
        fakeProvider({
          namespaces: {
            xrpl: fakeNamespace({ accountLines }, { connected: false }),
          },
          signer: fakeSigner(signAndSendTx),
        })
      ),
      params
    );

    expect(transitions).toEqual(
      blocked({ reason: 'wallet_disconnected', walletType: 'gem' })
    );
    expect(accountLines).not.toHaveBeenCalled();
    expect(signAndSendTx).not.toHaveBeenCalled();
  });

  it('parks the step when the wallet is connected with another account', async () => {
    const transitions = await runPrerequisite(
      execution(xrplTx),
      contextFor(
        fakeProvider({
          namespaces: {
            xrpl: fakeNamespace(
              { accountLines: vi.fn() },
              { accounts: [account('rOTHER', 'xrpl:0')] }
            ),
          },
        })
      ),
      params
    );

    expect(transitions).toEqual(
      blocked({
        reason: 'wrong_account',
        walletType: 'gem',
        requiredAddress: 'rWALLET',
      })
    );
  });

  it('fails with the signer code when the wallet rejects', async () => {
    const exec = execution(xrplTx);
    const signAndSendTx = vi
      .fn()
      .mockRejectedValue(new SignerError(SignerErrorCode.REJECTED_BY_USER));

    const transitions = await runPrerequisite(
      exec,
      contextFor(
        xrplProvider(vi.fn().mockResolvedValue([]), fakeSigner(signAndSendTx))
      ),
      params
    );

    expect(transitions).toMatchObject(failed('REJECTED_BY_USER'));
  });

  it('fails with CALL_OR_SEND_FAILED when the wallet throws anything else', async () => {
    const exec = execution(xrplTx);
    const signAndSendTx = vi.fn().mockRejectedValue(new Error('boom'));

    const transitions = await runPrerequisite(
      exec,
      contextFor(
        xrplProvider(vi.fn().mockResolvedValue([]), fakeSigner(signAndSendTx))
      ),
      params
    );

    expect(transitions).toMatchObject([
      { failure: { code: 'CALL_OR_SEND_FAILED', message: 'boom' } },
    ]);
  });

  it('fails when the trust lines cannot be read', async () => {
    const exec = execution(xrplTx);
    const accountLines = vi.fn().mockRejectedValue(new Error('offline'));

    const transitions = await runPrerequisite(
      exec,
      contextFor(xrplProvider(accountLines)),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
  });

  it.each([
    [
      'the swap has no XRPL wallet',
      (exec: SwapExecution) => {
        delete exec.wallets.XRPL;
        return xrplProvider();
      },
    ],
    ['the provider is not available', () => undefined],
    ['the provider has no xrpl namespace', () => fakeProvider()],
    [
      'the provider exposes no signers',
      () => xrplProvider(vi.fn().mockResolvedValue([]), null),
    ],
  ])('fails with CLIENT_UNEXPECTED_BEHAVIOUR when %s', async (_, setup) => {
    const exec = execution(xrplTx);
    const provider = setup(exec);

    const transitions = await runPrerequisite(
      exec,
      contextFor(provider),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
  });

  describe('with a pending TrustSet', () => {
    const pending: TransactionPrerequisiteResult = {
      prerequisiteIndex: 0,
      prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
      status: 'pending',
      data: { executedTransactionHash: 'TXHASH' },
    };

    function lookup(result: Record<string, unknown>) {
      xrplClient.request.mockResolvedValue({ result });
    }

    it('looks the transaction up and disconnects afterwards', async () => {
      lookup({ validated: false });
      const exec = execution(xrplTx, [pending]);
      const accountLines = vi.fn();

      await runPrerequisite(
        exec,
        contextFor(xrplProvider(accountLines)),
        params
      );

      expect(xrplClient.connect).toHaveBeenCalledOnce();
      expect(xrplClient.request).toHaveBeenCalledWith({
        command: 'tx',
        transaction: 'TXHASH',
      });
      expect(xrplClient.disconnect).toHaveBeenCalledOnce();
      expect(accountLines).not.toHaveBeenCalled();
    });

    it('reports nothing while the transaction is not validated', async () => {
      lookup({ validated: false });
      const exec = execution(xrplTx, [pending]);

      const transitions = await runPrerequisite(
        exec,
        contextFor(xrplProvider()),
        params
      );

      expect(transitions).toEqual([]);
    });

    it('throws for the loop to retry when the ledger cannot be reached', async () => {
      xrplClient.request.mockRejectedValue(new Error('offline'));
      const exec = execution(xrplTx, [pending]);

      await expect(
        runPrerequisite(exec, contextFor(xrplProvider()), params)
      ).rejects.toThrow('offline');
      expect(xrplClient.disconnect).toHaveBeenCalledOnce();
    });

    it('records success once the transaction is validated with tesSUCCESS', async () => {
      lookup({ validated: true, meta: { TransactionResult: 'tesSUCCESS' } });
      const exec = execution(xrplTx, [pending]);

      const transitions = await runPrerequisite(
        exec,
        contextFor(xrplProvider()),
        params
      );

      expect(transitions).toEqual([
        {
          type: 'prerequisite_updated',
          stepIndex: 0,
          result: { ...pending, status: 'success' },
        },
      ]);
    });

    it.each([
      ['another result', { TransactionResult: 'tecNO_LINE_INSUF_RESERVE' }],
      ['binary meta', 'DEADBEEF'],
      ['no meta', undefined],
    ])(
      'records failure once the transaction is validated with %s',
      async (_, meta) => {
        lookup({ validated: true, meta });
        const exec = execution(xrplTx, [pending]);

        const transitions = await runPrerequisite(
          exec,
          contextFor(xrplProvider()),
          params
        );

        expect(transitions).toEqual([
          {
            type: 'prerequisite_updated',
            stepIndex: 0,
            result: { ...pending, status: 'failed' },
          },
        ]);
      }
    );
  });
});

describe('Stellar trust line', () => {
  const openLine = {
    asset_type: 'credit_alphanum4',
    asset_code: 'USDC',
    asset_issuer: STELLAR_ISSUER,
    limit: STELLAR_INFINITE,
  };

  it('skips when a line for the asset already has the full limit', async () => {
    const exec = execution(stellarTx);
    const balanceLines = vi
      .fn()
      .mockResolvedValue([
        { asset_type: 'native', balance: '10' },
        { asset_type: 'liquidity_pool_shares', limit: STELLAR_INFINITE },
        openLine,
      ]);
    const signAndSendTx = vi.fn();

    const transitions = await runPrerequisite(
      exec,
      contextFor(stellarProvider(balanceLines, fakeSigner(signAndSendTx))),
      params
    );

    expect(balanceLines).toHaveBeenCalledWith('GWALLET');
    expect(transitions).toEqual([
      {
        type: 'prerequisite_updated',
        stepIndex: 0,
        result: {
          prerequisiteIndex: 0,
          prerequisiteType: STELLAR_CHANGE_TRUSTLINE_TYPE,
          status: 'skipped',
          data: null,
        },
      },
    ]);
    expect(signAndSendTx).not.toHaveBeenCalled();
  });

  it.each([
    ['no line', []],
    ['a line with a lower limit', [{ ...openLine, limit: '100' }]],
    ['a line for another issuer', [{ ...openLine, asset_issuer: 'GOTHER' }]],
  ])(
    'signs a ChangeTrust and records success when there is %s',
    async (_, lines) => {
      const exec = execution(stellarTx);
      const signAndSendTx = vi.fn().mockResolvedValue({ hash: 'TXHASH' });

      const transitions = await runPrerequisite(
        exec,
        contextFor(
          stellarProvider(
            vi.fn().mockResolvedValue(lines),
            fakeSigner(signAndSendTx)
          )
        ),
        params
      );

      expect(signAndSendTx).toHaveBeenCalledOnce();
      const [tx, address, chainId] = signAndSendTx.mock.calls[0] as [
        StellarTransaction,
        string,
        string | null
      ];
      expect(address).toBe('GWALLET');
      expect(chainId).toBe(CHAIN_IDS.STELLAR);
      expect(tx).toMatchObject({
        type: TransactionType.STELLAR,
        blockChain: 'STELLAR',
        prerequisites: [],
        data: { baseFee: '100', memoXdrBase64: null },
      });
      expect(tx.data.operationsXdrBase64).toHaveLength(1);
      const operation = Operation.fromXDRObject(
        xdr.Operation.fromXDR(tx.data.operationsXdrBase64[0], 'base64')
      );
      expect(operation).toMatchObject({
        type: 'changeTrust',
        line: { code: 'USDC', issuer: STELLAR_ISSUER },
        limit: STELLAR_INFINITE,
      });

      expect(transitions).toEqual([
        {
          type: 'prerequisite_updated',
          stepIndex: 0,
          result: {
            prerequisiteIndex: 0,
            prerequisiteType: STELLAR_CHANGE_TRUSTLINE_TYPE,
            status: 'success',
            data: { executedTransactionHash: 'TXHASH' },
          },
        },
      ]);
    }
  );

  it('parks the step before reading the lines when the wallet is disconnected', async () => {
    const balanceLines = vi.fn();

    const transitions = await runPrerequisite(
      execution(stellarTx),
      contextFor(
        fakeProvider({
          namespaces: {
            stellar: fakeNamespace({ balanceLines }, { connected: false }),
          },
        })
      ),
      params
    );

    expect(transitions).toEqual(
      blocked({ reason: 'wallet_disconnected', walletType: 'freighter' })
    );
    expect(balanceLines).not.toHaveBeenCalled();
  });

  it('fails with the signer code when the wallet rejects', async () => {
    const exec = execution(stellarTx);
    const signAndSendTx = vi
      .fn()
      .mockRejectedValue(new SignerError(SignerErrorCode.SIGN_TX_ERROR));

    const transitions = await runPrerequisite(
      exec,
      contextFor(
        stellarProvider(
          vi.fn().mockResolvedValue([]),
          fakeSigner(signAndSendTx)
        )
      ),
      params
    );

    expect(transitions).toMatchObject(failed('SIGN_TX_ERROR'));
  });

  it('fails when the balance lines cannot be read', async () => {
    const exec = execution(stellarTx);
    const balanceLines = vi.fn().mockRejectedValue(new Error('offline'));

    const transitions = await runPrerequisite(
      exec,
      contextFor(stellarProvider(balanceLines)),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
  });

  it('fails when asked to continue a pending result, which Stellar never has', async () => {
    const pending: TransactionPrerequisiteResult = {
      prerequisiteIndex: 0,
      prerequisiteType: STELLAR_CHANGE_TRUSTLINE_TYPE,
      status: 'pending',
      data: { executedTransactionHash: 'TXHASH' },
    };
    const exec = execution(stellarTx, [pending]);
    const balanceLines = vi.fn();

    const transitions = await runPrerequisite(
      exec,
      contextFor(stellarProvider(balanceLines)),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
    expect(balanceLines).not.toHaveBeenCalled();
  });
});
