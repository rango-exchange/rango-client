import type { ActionContext } from '../../../context';
import type { SwapExecution } from '../../../types';
import type { WalletEnvironment } from '../../environment/mod';
import type {
  TransactionPrerequisiteResult,
  XrplChangeTrustLinePrerequisite,
  XrplChangeTrustLinePrerequisiteResult,
  XrplTransaction,
} from 'rango-types';
import type { TrustSet, TxResponse } from 'xrpl';

import BigNumber from 'bignumber.js';
import { TransactionType, XRPL_CHANGE_TRUSTLINE_TYPE } from 'rango-types';

import { ActionError } from '../../../../errors';
import { ensureWalletConnected } from '../../environment/mod';
import { getSigner, signAndSendTx } from '../../signer';

import {
  XRPL_PUBLIC_SERVER,
  XRPL_TRUST_LINE_INFINITE_VALUE,
} from './constants';

type XrplNamespace = WalletEnvironment<'xrpl'>['namespace'];

/**
 * Runs an XRPL trust line prerequisite one step further.
 *
 * With no result yet, it makes sure the wallet is connected with the swap's
 * account, then reads its trust lines: a line to the issuer with the full
 * limit means nothing to do (`skipped`); otherwise it signs a `TrustSet` and
 * records the hash as `pending`. With a `pending` result, it looks the
 * transaction up on the ledger: not validated yet returns `null` so the loop
 * asks again; `tesSUCCESS` gives `success`, anything else `failed`. A lookup
 * the ledger does not answer is thrown for the loop to retry.
 */
export async function executeXrplChangeTrustLinePrerequisite(
  exec: SwapExecution,
  params: {
    prerequisite: XrplChangeTrustLinePrerequisite;
    prerequisiteIndex: number;
    current: TransactionPrerequisiteResult | undefined;
  },
  context: ActionContext
): Promise<XrplChangeTrustLinePrerequisiteResult | null> {
  const { prerequisite, prerequisiteIndex, current } = params;

  if (current) {
    if (
      current.prerequisiteType !== XRPL_CHANGE_TRUSTLINE_TYPE ||
      current.status !== 'pending'
    ) {
      throw new ActionError(
        'CLIENT_UNEXPECTED_BEHAVIOUR',
        `XRPL trust line prerequisite ${prerequisiteIndex} cannot continue from status ${current.status}`
      );
    }
    return checkTrustLineTransaction(
      prerequisiteIndex,
      current.data.executedTransactionHash
    );
  }

  const {
    wallet,
    provider,
    namespace: xrpl,
    chainId,
  } = ensureWalletConnected(exec, context, {
    blockChain: prerequisite.blockChain,
    namespaceKey: 'xrpl',
  });

  if (await isTrustLineOpen(xrpl, prerequisite)) {
    return {
      prerequisiteIndex,
      prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
      status: 'skipped',
      data: null,
    };
  }

  const signer = await getSigner<XrplTransaction>(
    provider,
    TransactionType.XRPL
  );
  const { hash } = await signAndSendTx(
    signer,
    createTrustSetTransaction(prerequisite),
    wallet.address,
    chainId
  );

  return {
    prerequisiteIndex,
    prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
    status: 'pending',
    data: { executedTransactionHash: hash },
  };
}

async function isTrustLineOpen(
  xrpl: XrplNamespace,
  prerequisite: XrplChangeTrustLinePrerequisite
): Promise<boolean> {
  let lines: Awaited<ReturnType<XrplNamespace['accountLines']>>;
  try {
    lines = await xrpl.accountLines(prerequisite.wallet, {
      peer: prerequisite.issuer,
    });
  } catch (error) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      'Could not read the account lines from XRPL',
      error
    );
  }

  const line = lines.find(
    (line) =>
      line.currency === prerequisite.currency &&
      line.account === prerequisite.issuer
  );
  if (!line) {
    return false;
  }

  return new BigNumber(line.limit).gte(XRPL_TRUST_LINE_INFINITE_VALUE);
}

function createTrustSetTransaction(
  prerequisite: XrplChangeTrustLinePrerequisite
): XrplTransaction {
  return {
    type: TransactionType.XRPL,
    blockChain: prerequisite.blockChain,
    prerequisites: [],
    data: {
      TransactionType: 'TrustSet',
      Account: prerequisite.wallet,
      LimitAmount: {
        currency: prerequisite.currency,
        issuer: prerequisite.issuer,
        value: XRPL_TRUST_LINE_INFINITE_VALUE,
      },
    },
  };
}

/** Looks a sent `TrustSet` up on the ledger; `null` while it is not validated yet. */
async function checkTrustLineTransaction(
  prerequisiteIndex: number,
  hash: string
): Promise<XrplChangeTrustLinePrerequisiteResult | null> {
  const { Client } = await import('xrpl');
  const client = new Client(XRPL_PUBLIC_SERVER);
  await client.connect();

  let response: TxResponse<TrustSet>;
  try {
    response = await client.request({ command: 'tx', transaction: hash });
  } finally {
    await client.disconnect();
  }

  if (!response.result.validated) {
    return null;
  }

  const meta = response.result.meta;
  // `meta` is only a string when the transaction was requested in binary form.
  const succeeded =
    typeof meta !== 'string' && meta?.TransactionResult === 'tesSUCCESS';

  return {
    prerequisiteIndex,
    prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
    status: succeeded ? 'success' : 'failed',
    data: { executedTransactionHash: hash },
  };
}
