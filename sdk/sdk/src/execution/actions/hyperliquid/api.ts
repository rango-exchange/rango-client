import type { SplitSignature } from './typedData';
import type { HyperliquidTransaction } from 'rango-sdk';

import { ActionError, RangoSdkError } from '../../../errors';

import {
  HYPERLIQUID_EXCHANGE_API_URL,
  HYPERLIQUID_EXPLORER_API_URL,
  HYPERLIQUID_SUPPORTED_ACTIONS,
} from './constants';

type ExchangeResponse = { status?: string; response?: unknown };

type ExplorerTransaction = {
  hash?: string;
  action?: { type?: string; time?: number };
};

type ExplorerResponse = { txs?: unknown };

/**
 * Submits a signed user action to the exchange. The signature is already
 * given, so a failure here is a failed send rather than something to retry
 * with a fresh prompt.
 */
export async function submitAction(
  action: HyperliquidTransaction['action'],
  signature: SplitSignature,
  nonce: number
): Promise<void> {
  let result: ExchangeResponse;
  try {
    const response = await fetch(HYPERLIQUID_EXCHANGE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, signature, nonce }),
    });
    result = await response.json();
  } catch (error) {
    throw new ActionError(
      'SEND_TX_FAILED',
      'Could not submit the action to the Hyperliquid exchange',
      error
    );
  }

  if (result?.status !== 'ok') {
    throw new ActionError(
      'SEND_TX_FAILED',
      `Hyperliquid rejected the ${action.type}: ${describe(result?.response)}`,
      result
    );
  }
}

/**
 * The hash of a submitted action, found in the wallet's history on the
 * explorer by the nonce it was submitted with. `null` while the explorer
 * does not list it yet. An explorer that cannot be reached, or answers
 * something else, is thrown for the loop to retry.
 */
export async function lookupTransactionHash(
  address: string,
  nonce: number
): Promise<string | null> {
  const response = await fetch(HYPERLIQUID_EXPLORER_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'userDetails', user: address }),
  });
  const result: ExplorerResponse = await response.json();

  if (!Array.isArray(result?.txs)) {
    throw new RangoSdkError(
      'The Hyperliquid explorer did not answer with a transaction list',
      result
    );
  }

  const match = (result.txs as ExplorerTransaction[]).find(
    (transaction) =>
      HYPERLIQUID_SUPPORTED_ACTIONS.includes(transaction.action?.type ?? '') &&
      transaction.action?.time === nonce
  );

  return match?.hash ?? null;
}

function describe(response: unknown): string {
  return typeof response === 'string' ? response : JSON.stringify(response);
}
