import type { ActionContext } from '../../../context';
import type { SwapExecution } from '../../../types';
import type { WalletEnvironment } from '../../environment/mod';
import type {
  StellarChangeTrustLinePrerequisite,
  StellarChangeTrustLinePrerequisiteResult,
  StellarTransaction,
  TransactionPrerequisiteResult,
} from 'rango-types';

import BigNumber from 'bignumber.js';
import { STELLAR_CHANGE_TRUSTLINE_TYPE, TransactionType } from 'rango-types';

import { ActionError } from '../../../../errors';
import { ensureWalletConnected } from '../../environment/mod';
import { getSigner, signAndSendTx } from '../../signer';

import {
  STELLAR_TRUST_LINE_FEE,
  STELLAR_TRUST_LINE_INFINITE_VALUE,
  STELLAR_TRUST_LINE_TIMEOUT,
} from './constants';

type StellarNamespace = WalletEnvironment<'stellar'>['namespace'];

const MILLISECONDS_PER_SECOND = 1000;

/**
 * Runs a Stellar trust line prerequisite. It makes sure the wallet is
 * connected with the swap's account, then reads its balance lines: a line
 * for the asset with the full limit means nothing to do (`skipped`);
 * otherwise it signs a `ChangeTrust` and records the hash. The wallet only
 * returns once the transaction is in, so the result is `success` right away
 * and there is no pending state to continue from.
 */
export async function executeStellarChangeTrustLinePrerequisite(
  exec: SwapExecution,
  params: {
    prerequisite: StellarChangeTrustLinePrerequisite;
    prerequisiteIndex: number;
    current: TransactionPrerequisiteResult | undefined;
  },
  context: ActionContext
): Promise<StellarChangeTrustLinePrerequisiteResult> {
  const { prerequisite, prerequisiteIndex, current } = params;

  if (current) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `Stellar trust line prerequisite ${prerequisiteIndex} cannot continue from status ${current.status}`
    );
  }

  const {
    wallet,
    provider,
    namespace: stellar,
    chainId,
  } = ensureWalletConnected(exec, context, {
    blockChain: prerequisite.blockChain,
    namespaceKey: 'stellar',
  });

  if (await isTrustLineOpen(stellar, prerequisite)) {
    return {
      prerequisiteIndex,
      prerequisiteType: STELLAR_CHANGE_TRUSTLINE_TYPE,
      status: 'skipped',
      data: null,
    };
  }

  const tx = await createChangeTrustTransaction(prerequisite);
  const signer = await getSigner<StellarTransaction>(
    provider,
    TransactionType.STELLAR
  );
  const { hash } = await signAndSendTx(signer, tx, wallet.address, chainId);

  return {
    prerequisiteIndex,
    prerequisiteType: STELLAR_CHANGE_TRUSTLINE_TYPE,
    status: 'success',
    data: { executedTransactionHash: hash },
  };
}

async function isTrustLineOpen(
  stellar: StellarNamespace,
  prerequisite: StellarChangeTrustLinePrerequisite
): Promise<boolean> {
  let lines: Awaited<ReturnType<StellarNamespace['balanceLines']>>;
  try {
    lines = await stellar.balanceLines(prerequisite.wallet);
  } catch (error) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      'Could not read the balance lines from Stellar',
      error
    );
  }

  for (const line of lines) {
    if (
      line.asset_type === 'native' ||
      line.asset_type === 'liquidity_pool_shares'
    ) {
      continue;
    }
    if (
      line.asset_code === prerequisite.code &&
      line.asset_issuer === prerequisite.issuer
    ) {
      return new BigNumber(line.limit).gte(STELLAR_TRUST_LINE_INFINITE_VALUE);
    }
  }

  return false;
}

async function createChangeTrustTransaction(
  prerequisite: StellarChangeTrustLinePrerequisite
): Promise<StellarTransaction> {
  const { Asset, Operation } = await import('@stellar/stellar-sdk');

  const operation = Operation.changeTrust({
    asset: new Asset(prerequisite.code, prerequisite.issuer),
    limit: STELLAR_TRUST_LINE_INFINITE_VALUE,
  });
  const now = Math.floor(Date.now() / MILLISECONDS_PER_SECOND);

  return {
    type: TransactionType.STELLAR,
    blockChain: prerequisite.blockChain,
    prerequisites: [],
    data: {
      baseFee: STELLAR_TRUST_LINE_FEE,
      memoXdrBase64: null,
      preconditions: {
        timeBounds: { minTime: 0, maxTime: now + STELLAR_TRUST_LINE_TIMEOUT },
        ledgerBounds: { minLedger: 0, maxLedger: 0 },
        minSeqNumber: null,
        minSeqAge: null,
        minSeqLedgerGap: null,
        extraSigners: null,
      },
      operationsXdrBase64: [operation.toXDR('base64')],
    },
  };
}
