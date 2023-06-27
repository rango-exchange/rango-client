import type {
  APIErrorCode,
  SignerErrorCode as SignerErrorCodeType,
} from 'rango-types';
import {
  SignerErrorCode,
  SignerError,
  isSignerErrorCode,
  isAPIErrorCode,
} from 'rango-types';
import { DEFAULT_ERROR_CODE } from './constants';

export type ErrorDetail = {
  extraMessage: string;
  extraMessageDetail?: string | null | undefined;
  extraMessageErrorCode: SignerErrorCodeType | APIErrorCode | null;
};

const ERROR_ASSERTION_FAILED = 'Assertion failed (Unexpected behaviour)';
const ERROR_CREATE_TRANSACTION = 'Create transaction failed in Rango Server';
const ERROR_INPUT_WALLET_NOT_FOUND = 'Input wallet not found';

type ErrorRoot = string | Record<string, string> | null;

export class PrettyError extends Error {
  private readonly detail?: string;
  private readonly root?: ErrorRoot;
  private readonly code?: APIErrorCode;
  public _isPrettyError = true;

  constructor(
    code: APIErrorCode,
    m: string,
    root?: ErrorRoot,
    detail?: string
  ) {
    super(m);
    Object.setPrototypeOf(this, PrettyError.prototype);
    PrettyError.prototype._isPrettyError = true;
    this.code = code;
    this.detail = detail;
    this.root = root;
  }

  static isPrettyError(obj: unknown): obj is PrettyError {
    return (
      obj instanceof PrettyError ||
      Object.prototype.hasOwnProperty.call(obj, '_isPrettyError')
    );
  }

  getErrorDetail(): ErrorDetail {
    const rawMessage =
      typeof this.root === 'object' && this.root && this.root.error
        ? this.root.error
        : JSON.stringify(this.root);
    const rootStr =
      typeof this.root === 'string'
        ? this.root
        : this.root instanceof Error
        ? this.root.message
        : rawMessage;
    return {
      extraMessage: this.message,
      extraMessageDetail: this.detail || rootStr,
      extraMessageErrorCode: this.code || null,
    };
  }

  static AssertionFailed(m: string): PrettyError {
    return new PrettyError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      ERROR_ASSERTION_FAILED,
      m
    );
  }

  static BadStatusCode(
    message: string,
    statusCode: number | string
  ): PrettyError {
    return new PrettyError(
      'TX_FAIL',
      message,
      null,
      `status code = ${statusCode}`
    );
  }

  static CreateTransaction(detail: string): PrettyError {
    return new PrettyError(
      'FETCH_TX_FAILED',
      ERROR_CREATE_TRANSACTION,
      null,
      detail
    );
  }

  static WalletMissing(): PrettyError {
    return new PrettyError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      ERROR_INPUT_WALLET_NOT_FOUND,
      null,
      'Server requested for a blockchain or address not selected by user'
    );
  }

  static BlockchainMissing(): PrettyError {
    return new PrettyError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      ERROR_INPUT_WALLET_NOT_FOUND,
      null,
      'Server requested for a blockchain or address not selected by user'
    );
  }
}

export function mapAppErrorCodesToAPIErrorCode(
  errorCode: string | null
): APIErrorCode {
  try {
    if (!errorCode) return DEFAULT_ERROR_CODE;
    if (isAPIErrorCode(errorCode)) return errorCode;
    if (isSignerErrorCode(errorCode)) {
      const t: { [key in SignerErrorCodeType]: APIErrorCode } = {
        [SignerErrorCode.REJECTED_BY_USER]: 'USER_REJECT',
        [SignerErrorCode.SIGN_TX_ERROR]: 'CALL_WALLET_FAILED',
        [SignerErrorCode.SEND_TX_ERROR]: 'SEND_TX_FAILED',
        [SignerErrorCode.TX_FAILED_IN_BLOCKCHAIN]: 'TX_FAILED_IN_BLOCKCHAIN',
        [SignerErrorCode.NOT_IMPLEMENTED]: DEFAULT_ERROR_CODE,
        [SignerErrorCode.OPERATION_UNSUPPORTED]: DEFAULT_ERROR_CODE,
        [SignerErrorCode.UNEXPECTED_BEHAVIOUR]: DEFAULT_ERROR_CODE,
      };
      return t[errorCode];
    }
    return DEFAULT_ERROR_CODE;
  } catch (err) {
    return DEFAULT_ERROR_CODE;
  }
}

export const prettifyErrorMessage = (obj: unknown): ErrorDetail => {
  if (!obj) return { extraMessage: '', extraMessageErrorCode: null };
  if (PrettyError.isPrettyError(obj)) return obj.getErrorDetail();
  if (SignerError.isSignerError(obj)) {
    const t = obj.getErrorDetail();
    return {
      extraMessage: t.message,
      extraMessageDetail: t.detail,
      extraMessageErrorCode: t.code,
    };
  }
  if (obj instanceof Error)
    return {
      extraMessage: obj.toString(),
      extraMessageErrorCode: null,
    };
  if (typeof obj !== 'string')
    return {
      extraMessage: JSON.stringify(obj),
      extraMessageErrorCode: null,
    };
  return { extraMessage: obj, extraMessageErrorCode: null };
};
