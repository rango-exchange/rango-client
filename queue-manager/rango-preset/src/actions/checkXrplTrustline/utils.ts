import type { TargetToken, XrplNamespace } from './types';
import type { TargetNamespace } from '../../shared';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type {
  BlockedReason,
  ExecuterActions,
} from '@rango-dev/queue-manager-core';
import type { WalletType } from '@rango-dev/wallets-shared';
import type { PendingSwap, XrplTransaction } from 'rango-types';
import type { Result } from 'ts-results';

import { legacyReadAccountAddress as readAccountAddress } from '@rango-dev/wallets-core/legacy';
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

export async function ensureXrplNamespaceExists(
  context: SwapQueueContext,
  walletType: string
): Promise<Result<XrplNamespace, NextTransactionStateError>> {
  // We need to work with namespace instance
  const provider = context.hubProvider(walletType);
  const xrplNamespace = provider.get('xrpl');
  if (!xrplNamespace) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'XRPL is not available on your wallet.',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }
  return Ok(xrplNamespace);
}

export async function checkIfTrustLineIsAlreadyOpened(
  account: string,
  token: TargetToken,
  options: { namespace: XrplNamespace }
): Promise<
  Result<{ trustLineIsAlreadyOpened: boolean }, NextTransactionStateError>
> {
  const tokenAmount = new BigNumber(token.amount);

  try {
    // Get account lines for the account
    const accountLines = await options.namespace.accountLines(account, {
      peer: token.account,
    });

    // Find the target account line
    const targetAccountLine = accountLines.find(
      (accountLine) =>
        accountLine.currency === token.currency &&
        accountLine.account === token.account
    );

    // If not account line is open on the target token, return false
    if (!targetAccountLine) {
      return new Ok({
        trustLineIsAlreadyOpened: false,
      });
    }

    const lineLimit = new BigNumber(targetAccountLine.limit);
    const lineBalance = new BigNumber(targetAccountLine.balance);

    // If the account line is open, and contains a suitable limit, return true
    return new Ok({
      trustLineIsAlreadyOpened: lineLimit.gte(lineBalance.plus(tokenAmount)),
    });
  } catch {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'Could not get account lines from XRPL.',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }
}

export function createTrustLineTransaction(
  account: string,
  token: TargetToken
): XrplTransaction {
  return {
    type: TransactionType.XRPL,
    blockChain: 'XRPL',
    prerequisites: [],
    data: {
      TransactionType: 'TrustSet',
      Account: account,
      LimitAmount: {
        currency: token.currency,
        issuer: token.account,
        value: TRUST_LINE_INFINITE_VALUE,
      },
    },
  };
}

export function getXrplWalletFromSwap(swap: PendingSwap): {
  type: WalletType;
  namespace: TargetNamespace;
  address: string;
} | null {
  const xrplWallet = swap.wallets['XRPL'];

  if (!xrplWallet) {
    return null;
  }

  return {
    type: xrplWallet.walletType,
    namespace: {
      namespace: 'XRPL',
      network: 'XRPL',
    },
    address: xrplWallet.address,
  };
}

export async function ensureRequiredXrplWalletIsConnected(
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
