import { SignerErrorCode, isSignerErrorCode } from 'rango-types';

export type ErrorDetail = {
  extraMessage: string;
  extraMessageDetail?: string | null | undefined;
  extraMessageErrorCode: string | null;
};

export enum APIErrorCode {
  TX_EXPIRED = 'TX_EXPIRED',
  TX_FAIL = 'TX_FAIL',
  FETCH_TX_FAILED = 'FETCH_TX_FAILED',
  USER_REJECT = 'USER_REJECT',
  CALL_WALLET_FAILED = 'CALL_WALLET_FAILED',
  SEND_TX_FAILED = 'SEND_TX_FAILED',
  CALL_OR_SEND_FAILED = 'CALL_OR_SEND_FAILED',
  USER_CANCEL = 'USER_CANCEL',
  CLIENT_UNEXPECTED_BEHAVIOUR = 'CLIENT_UNEXPECTED_BEHAVIOUR',
}

export enum TransactionName {
  GenericTransaction = 'transaction',
  SendingOneInchTransaction = '1inch transaction',
  Approval = 'approve transaction',
}

export const ERROR_ASSERTION_FAILED = 'Assertion failed (Unexpected behaviour)';

export const ERROR_CREATE_TRANSACTION =
  'Create transaction failed in Rango Server';

export const ERROR_INPUT_WALLET_NOT_FOUND = 'Input wallet not found';

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
      APIErrorCode.CLIENT_UNEXPECTED_BEHAVIOUR,
      ERROR_ASSERTION_FAILED,
      m
    );
  }

  static BadStatusCode(
    message: string,
    statusCode: number | string
  ): PrettyError {
    return new PrettyError(
      APIErrorCode.TX_FAIL,
      message,
      null,
      `status code = ${statusCode}`
    );
  }

  static CreateTransaction(detail: string): PrettyError {
    return new PrettyError(
      APIErrorCode.FETCH_TX_FAILED,
      ERROR_CREATE_TRANSACTION,
      null,
      detail
    );
  }

  static WalletMissing(): PrettyError {
    return new PrettyError(
      APIErrorCode.CLIENT_UNEXPECTED_BEHAVIOUR,
      ERROR_INPUT_WALLET_NOT_FOUND,
      null,
      'Server requested for a blockchain or address not selected by user'
    );
  }

  static BlockchainMissing(): PrettyError {
    return new PrettyError(
      APIErrorCode.CLIENT_UNEXPECTED_BEHAVIOUR,
      ERROR_INPUT_WALLET_NOT_FOUND,
      null,
      'Server requested for a blockchain or address not selected by user'
    );
  }
}

export const ERROR_GETTING_BEST_ROUTE = (status: number | string): string =>
  `Failed to get best route (status: ${status}), please try again.`;

export const ERROR_CONFIRM_SWAP = (status?: number | string): string =>
  `Failed to confirm swap (${!!status ? 'status' : 'route'}: ${
    status || null
  }), please try again.`;

export const WARNING_STARKNET_FOUND =
  'StarknNet blockchain is still an ALPHA version. As such, delays may occur, and catastrophic bugs may lurk.';

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
