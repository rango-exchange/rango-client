import { WalletType } from '@rango-dev/wallets-shared';
import { getCookieId, SwapperStatusResponse } from './shared';
import {
  CheckApprovalResponse,
  CheckTxStatusRequest,
  CreateTransactionRequest,
  CreateTransactionResponse,
} from 'rango-sdk';
import {
  APIErrorCode,
  ApiMethodName,
  ERROR_COMMUNICATING_WITH_API,
  PrettyError,
} from './shared-errors';
import { BigNumber } from 'bignumber.js';
import {
  BASE_URL,
  RANGO_COOKIE_HEADER,
  RANGO_DAPP_ID_QUERY,
} from './constants';
import { isSignerErrorCode, SignerErrorCode } from 'rango-types';

export async function checkSwapStatus(
  requestId: string,
  txId: string,
  step: number
): Promise<SwapperStatusResponse | null> {
  const url = `${BASE_URL}/tx/check-status?${RANGO_DAPP_ID_QUERY}`;
  const body: CheckTxStatusRequest = { step, txId, requestId };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      [RANGO_COOKIE_HEADER]: getCookieId(),
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(body),
  });

  if (
    (!!response.status && (response.status < 200 || response.status >= 400)) ||
    !response.ok
  ) {
    const apiError = ERROR_COMMUNICATING_WITH_API(
      ApiMethodName.CheckingTransactionStatus
    );
    throw PrettyError.BadStatusCode(apiError, response.status);
  }

  const res = await response.json();
  return {
    ...res,
    outputAmount: res.outputAmount ? new BigNumber(res.outputAmount) : null,
  };
}

export async function createTransaction(
  request: CreateTransactionRequest
): Promise<CreateTransactionResponse> {
  const url = `${BASE_URL}/tx/create?${RANGO_DAPP_ID_QUERY}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        [RANGO_COOKIE_HEADER]: getCookieId(),
      },
      body: JSON.stringify(request),
    });

    if (
      (!!response.status &&
        (response.status < 200 || response.status >= 400)) ||
      !response.ok
    ) {
      throw PrettyError.CreateTransaction(
        `Error creating the transaction, status code: ${response.status}`
      );
    }

    const result: CreateTransactionResponse = await response.json();
    if (!result.ok || !result.transaction)
      throw PrettyError.CreateTransaction(
        result.error || 'bad response from create tx endpoint'
      );

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    if (error instanceof Error) {
      throw PrettyError.CreateTransaction(error.message);
    }
    throw error;
  }
}

export async function checkApproved(
  requestId: string
): Promise<CheckApprovalResponse> {
  const url = `${BASE_URL}/tx/${requestId}/check-approval?${RANGO_DAPP_ID_QUERY}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      [RANGO_COOKIE_HEADER]: getCookieId(),
    },
  });

  if (
    (!!response.status && (response.status < 200 || response.status >= 400)) ||
    !response.ok
  ) {
    const apiError = ERROR_COMMUNICATING_WITH_API(ApiMethodName.CheckApproval);
    throw PrettyError.BadStatusCode(apiError, response.status);
  }

  return await response.json();
}

function isAPIErrorCode(value: string): value is APIErrorCode {
  return (Object.values(APIErrorCode) as string[]).includes(value);
}

export function mapAppErrorCodesToAPIErrorCode(
  errorCode: string | null
): APIErrorCode {
  const defaultErrorCode = APIErrorCode.CLIENT_UNEXPECTED_BEHAVIOUR;
  try {
    if (!errorCode) return defaultErrorCode;
    if (isAPIErrorCode(errorCode)) return errorCode;
    if (isSignerErrorCode(errorCode)) {
      const t: { [key in SignerErrorCode]: APIErrorCode } = {
        [SignerErrorCode.REJECTED_BY_USER]: APIErrorCode.USER_REJECT,
        [SignerErrorCode.SIGN_TX_ERROR]: APIErrorCode.CALL_WALLET_FAILED,
        [SignerErrorCode.SEND_TX_ERROR]: APIErrorCode.SEND_TX_FAILED,
        [SignerErrorCode.NOT_IMPLEMENTED]: defaultErrorCode,
        [SignerErrorCode.OPERATION_UNSUPPORTED]: defaultErrorCode,
        [SignerErrorCode.UNEXPECTED_BEHAVIOUR]: defaultErrorCode,
      };
      return t[errorCode];
    }
    return defaultErrorCode;
  } catch (err) {
    return defaultErrorCode;
  }
}

export async function reportFailed(
  requestId: string,
  step: number,
  eventType: APIErrorCode,
  reason: string,
  walletType: WalletType | null
): Promise<void> {
  const url = `${BASE_URL}/tx/report-tx?${RANGO_DAPP_ID_QUERY}`;
  await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      [RANGO_COOKIE_HEADER]: getCookieId(),
    },
    body: JSON.stringify({
      requestId,
      step,
      eventType,
      reason,
      tags: {
        wallet: walletType,
      },
    }),
  });
}
