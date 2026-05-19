import type { StellarNamespace, TargetToken } from './types';
import type { TargetNamespace } from '../../shared';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type {
  BlockedReason,
  ExecuterActions,
} from '@rango-dev/queue-manager-core';
import type { WalletType } from '@rango-dev/wallets-shared';
import type { PendingSwap, StellarTransaction } from 'rango-types';
import type { Result } from 'ts-results';

import { legacyReadAccountAddress as readAccountAddress } from '@rango-dev/wallets-core/legacy';
import * as StellarSdk from '@stellar/stellar-sdk';
import BigNumber from 'bignumber.js';
import { TransactionType } from 'rango-types';
import { Err, Ok } from 'ts-results';

import {
  ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION,
  ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION_WRONG_WALLET,
} from '../../constants';
import {
  BlockReason,
  type SwapActionTypes,
  type SwapQueueContext,
  type SwapStorage,
} from '../../types';

import { TRUST_LINE_INFINITE_VALUE } from './constants';

export async function ensureStellarNamespaceExists(
  context: SwapQueueContext,
  walletType: string
): Promise<Result<StellarNamespace, NextTransactionStateError>> {
  // We need to work with namespace instance
  const provider = context.hubProvider(walletType);
  const stellarNamespace = provider.get('stellar');
  if (!stellarNamespace) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'Stellar is not available on your wallet.',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }
  return Ok(stellarNamespace);
}

export async function checkIfTrustLineIsAlreadyOpened(
  account: string,
  token: TargetToken,
  options: { namespace: StellarNamespace }
): Promise<
  Result<{ trustLineIsAlreadyOpened: boolean }, NextTransactionStateError>
> {
  try {
    // Get account lines for the account
    const accountLines = await options.namespace.balanceLines(account);

    // Find the target account line
    const targetAccountLine = accountLines
      .filter(
        (accountLine) =>
          accountLine.asset_type !== 'native' &&
          accountLine.asset_type !== 'liquidity_pool_shares'
      )
      .find(
        (accountLine) =>
          accountLine.asset_code === token.code &&
          accountLine.asset_issuer === token.issuer
      );

    // If not account line is open on the target token, return false
    if (!targetAccountLine) {
      return new Ok({
        trustLineIsAlreadyOpened: false,
      });
    }

    const lineLimit = new BigNumber(targetAccountLine.limit);
    const targetLimit = new BigNumber(TRUST_LINE_INFINITE_VALUE);

    /*
     * If the account line is open, and contains a suitable limit, return true
     * TODO: we can add some logic to check if the target limit has enough capacity to hold the token amount,
     * but it needs that we always get the correct needed limit value in prerequisites
     */
    return new Ok({
      trustLineIsAlreadyOpened: lineLimit.gte(targetLimit),
    });
  } catch {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'Could not get account lines from Stellar.',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }
}

export function createTrustLineTransaction(
  _accountId: string,
  token: TargetToken
): StellarTransaction {
  const asset = new StellarSdk.Asset(token.code, token.issuer);
  const TRUST_LINE_FEE = '100';
  const TRUST_LINE_TIMEOUT = 30;
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const now = Math.floor(Date.now() / 1000);

  const operation = StellarSdk.Operation.changeTrust({
    asset,
    limit: TRUST_LINE_INFINITE_VALUE,
  });

  return {
    type: TransactionType.STELLAR,
    blockChain: 'Stellar',
    prerequisites: [],
    data: {
      baseFee: TRUST_LINE_FEE,
      memoXdrBase64: null,
      preconditions: {
        timeBounds: {
          minTime: 0,
          maxTime: now + TRUST_LINE_TIMEOUT,
        },
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

export function getStellarWalletFromSwap(swap: PendingSwap): {
  type: WalletType;
  namespace: TargetNamespace;
  address: string;
} | null {
  const stellarWallet = swap.wallets['STELLAR'];

  if (!stellarWallet) {
    return null;
  }

  return {
    type: stellarWallet.walletType,
    namespace: {
      namespace: 'Stellar',
      network: 'Stellar',
    },
    address: stellarWallet.address,
  };
}

export async function ensureRequiredStellarWalletIsConnected(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>,
  requiredWallet: {
    type: WalletType;
    namespace: TargetNamespace;
    address: string;
  }
): Promise<Result<true, BlockedReason>> {
  const { context } = actions;

  const walletState = context.state(requiredWallet.type);
  const { accounts, connected } = walletState;

  if (!connected) {
    return new Err({
      reason: BlockReason.WAIT_FOR_CONNECT_WALLET,
      description: ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION(
        requiredWallet.type
      ),
    });
  }

  if (
    !accounts?.find(
      (account) =>
        readAccountAddress(account).address === requiredWallet.address
    )
  ) {
    return new Err({
      reason: BlockReason.WAIT_FOR_CONNECT_WALLET,
      description: ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION_WRONG_WALLET(
        requiredWallet.type,
        requiredWallet.address
      ),
    });
  }

  return new Ok(true);
}
