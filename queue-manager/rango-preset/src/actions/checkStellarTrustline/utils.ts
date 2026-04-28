import type { StellarNamespace, TargetToken } from './types';
import type { SwapQueueContext } from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { StellarTransaction, Transaction } from 'rango-sdk';

import * as StellarSdk from '@stellar/stellar-sdk';
import { isStellarTransaction, TransactionType } from 'rango-types';
import { Err, Ok, type Result } from 'ts-results';

import {
  TRUST_LINE_AMOUNT,
  TRUST_LINE_FEE,
  TRUST_LINE_TIMEOUT,
} from './constants';

export async function ensureStellarTransactionIsValid(
  tx: Transaction | null
): Promise<Result<StellarTransaction, NextTransactionStateError>> {
  if (!tx) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'Unexpected Error: tx is null!',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }

  if (!isStellarTransaction(tx)) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message:
        "Unexpected Error: Expected Stellar transaction but it doesn't match with the structure.",
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }

  if (!tx.xdrBase64) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'Unexpected Error: Transaction xdrBase64 is required',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }

  return Ok(tx);
}

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

export async function checkTrustLineAlreadyOpened(
  account: string,
  token: TargetToken,
  options: { namespace: StellarNamespace }
): Promise<boolean> {
  const lines = await options.namespace.accountLines(account);
  return !!lines.some((trustline) => {
    return (
      trustline.code === token.code &&
      trustline.issuer === token.issuer &&
      trustline.limit !== '0'
    );
  });
}

export async function createTrustlineTransaction(
  accountId: string,
  token: TargetToken
): Promise<StellarTransaction> {
  const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
  const account = await server.loadAccount(accountId);
  const asset = new StellarSdk.Asset(token.code, token.issuer);

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: TRUST_LINE_FEE,
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
  })
    .addOperation(
      StellarSdk.Operation.changeTrust({
        asset: asset,
        limit: TRUST_LINE_AMOUNT, // optional max holding
      })
    )
    .setTimeout(TRUST_LINE_TIMEOUT) // transaction will be valid for 30 seconds
    .build();

  return {
    type: TransactionType.STELLAR,
    blockChain: 'Stellar',
    xdrBase64: transaction.toXDR(),
    preconditions: [],
  };
}
