import {
  APIErrorCode,
  SignerError,
  SignerErrorCode,
  isSignerErrorCode,
} from 'rango-types';

export type ErrorDetail = {
  extraMessage: string;
  extraMessageDetail?: string | null | undefined;
  extraMessageErrorCode: SignerErrorCode | APIErrorCode | null;
};

const ERROR_ASSERTION_FAILED = 'Assertion failed (Unexpected behaviour)';
const ERROR_CREATE_TRANSACTION = 'Create transaction failed in Rango Server';
const ERROR_INPUT_WALLET_NOT_FOUND = 'Input wallet not found';

type ErrorRoot = string | Record<string, string> | null;

export class PrettyError extends Error {
  private readonly detail?: string;
  private readonly root?: ErrorRoot;
  private readonly code?: APIErrorCode;

  constructor(
    code: APIErrorCode,
    m: string,
    root?: ErrorRoot,
    detail?: string
  ) {
    super(m);
    Object.setPrototypeOf(this, PrettyError.prototype);
    this.code = code;
    this.detail = detail;
    this.root = root;
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

// TODO remove it and add it to sdk
function isAPIErrorCode(value: string): value is APIErrorCode {
  const apiErrorCodes = [
    'TX_FAIL',
    'TX_EXPIRED',
    'FETCH_TX_FAILED',
    'USER_REJECT',
    'USER_CANCEL',
    'CALL_WALLET_FAILED',
    'SEND_TX_FAILED',
    'CALL_OR_SEND_FAILED',
    'CLIENT_UNEXPECTED_BEHAVIOUR',
  ];
  return apiErrorCodes.includes(value);
}

export function mapAppErrorCodesToAPIErrorCode(
  errorCode: string | null
): APIErrorCode {
  const defaultErrorCode = 'CLIENT_UNEXPECTED_BEHAVIOUR';
  try {
    if (!errorCode) return defaultErrorCode;
    if (isAPIErrorCode(errorCode)) return errorCode;
    if (isSignerErrorCode(errorCode)) {
      const t: { [key in SignerErrorCode]: APIErrorCode } = {
        [SignerErrorCode.REJECTED_BY_USER]: 'USER_REJECT',
        [SignerErrorCode.SIGN_TX_ERROR]: 'CALL_WALLET_FAILED',
        [SignerErrorCode.SEND_TX_ERROR]: 'SEND_TX_FAILED',
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

export const isPrettyError = (obj: unknown): obj is PrettyError => {
  return (
    obj instanceof PrettyError ||
    Object.prototype.hasOwnProperty('_isPrettyError')
  );
};

export const isSignerError = (obj: unknown): obj is SignerError => {
  return (
    obj instanceof SignerError ||
    Object.prototype.hasOwnProperty('_isSignerError')
  );
};

export const prettifyErrorMessage = (obj: unknown): ErrorDetail => {
  if (!obj) return { extraMessage: '', extraMessageErrorCode: null };
  if (isPrettyError(obj)) return obj.getErrorDetail();
  if (isSignerError(obj)) {
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
