import type { UserDetailsResponse } from './types';
import type { Result } from 'ts-results';

import { Err, Ok } from 'ts-results';

import {
  GetHyperliquidTransactionHashError,
  HYPERLIQUID_EXPLORER_API_URL,
} from './constants';

export async function getHyperliquidTransactionHash(
  walletAddress: string,
  nonce: number
): Promise<Result<string, GetHyperliquidTransactionHashError>> {
  let userDetailsResponse: Response;
  try {
    userDetailsResponse = await fetch(HYPERLIQUID_EXPLORER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'userDetails', user: walletAddress }),
    });
  } catch {
    return new Err(GetHyperliquidTransactionHashError.FETCH_ERROR);
  }

  let userDetailsJson: UserDetailsResponse;
  try {
    userDetailsJson = await userDetailsResponse.json();

    if (!Array.isArray(userDetailsJson.txs)) {
      return new Err(GetHyperliquidTransactionHashError.RESPONSE_PARSING_ERROR);
    }
  } catch {
    return new Err(GetHyperliquidTransactionHashError.RESPONSE_PARSING_ERROR);
  }

  const currentUserDetailsItem = userDetailsJson.txs.find(
    (item) =>
      (item.action.type === 'withdraw3' || item.action.type === 'usdSend') &&
      item.action.time === nonce
  );

  if (!currentUserDetailsItem) {
    return new Err(GetHyperliquidTransactionHashError.TRANSACTION_NOT_FOUND);
  }

  return Ok(currentUserDetailsItem.hash);
}
