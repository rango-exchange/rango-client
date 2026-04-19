/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { EthersV6CompatibleTypedData } from './types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { HyperliquidTransaction, Transaction } from 'rango-sdk';
import type { Result } from 'ts-results';

import { mainAPI } from 'rango-types';
import { Err, Ok } from 'ts-results';

import { HYPERLIQUID_EXCHANGE_API_URL } from './constants';

export function ensureHyperliquidTransactionIsValid(
  tx: Transaction | null
): Result<HyperliquidTransaction, NextTransactionStateError> {
  if (!tx) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'Unexpected Error: tx is null!',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }

  if (!mainAPI.isHyperliquidTransaction(tx)) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message:
        "Unexpected Error: Expected Hyperliquid transaction but it doesn't match with the structure.",
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }

  if (tx.action.type !== 'withdraw3' && tx.action.type !== 'usdSend') {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'Unexpected Error: Transaction action is not supported.',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }

  if (!tx.message) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'Unexpected Error: Transaction message does not exist.',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }

  return Ok(tx);
}

export function getEthersV6CompatibleTypedDataFromMessage(
  message: string
): Result<EthersV6CompatibleTypedData, NextTransactionStateError> {
  try {
    const typedData = JSON.parse(message);
    const ethersV6CompatibleTypedData = {
      domain: typedData.domain,
      types: {
        [typedData.primaryType]: typedData.types[typedData.primaryType],
      },
      value: typedData.message,
    };
    return Ok(ethersV6CompatibleTypedData);
  } catch {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'Unexpected Error: Could not infer typed data from message.',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }
}

export async function initiateWithdrawalRequest(
  action: HyperliquidTransaction['action'],
  signature: Signature,
  nonce: HyperliquidTransaction['nonce']
): Promise<Result<{ status: string }, NextTransactionStateError>> {
  try {
    const initiateWithdrawalResponse = await fetch(
      HYPERLIQUID_EXCHANGE_API_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          signature,
          nonce,
        }),
      }
    );

    const initiateWithdrawalResponseJson =
      await initiateWithdrawalResponse.json();

    return Ok(initiateWithdrawalResponseJson);
  } catch {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: 'Unexpected Error: Failed to initiate withdrawal.',
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }
}

interface Signature {
  /** First 32-byte component of ECDSA signature. */
  r: string;
  /** Second 32-byte component of ECDSA signature. */
  s: string;
  /** Recovery identifier. */
  v: 27 | 28;
}
export function splitSignature( // validate and decode a 65-byte 0x… signature into { r, s, v } with v normalized to 27/28 for the Hyperliquid withdrawal request
  signature: `0x${string}`
): Result<Signature, NextTransactionStateError> {
  if (signature.length !== 132) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: `Expected 65-byte signature (132 hex chars), got ${signature.length}`,
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }
  const r = `0x${signature.slice(2, 66)}`;
  const s = `0x${signature.slice(66, 130)}`;
  let v = parseInt(signature.slice(130, 132), 16);
  if (v === 0 || v === 1) {
    v += 27;
  }
  if (v !== 27 && v !== 28) {
    return new Err({
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: `Invalid signature recovery value: ${v}, expected 27 or 28`,
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
  }
  return Ok({ r, s, v });
}
