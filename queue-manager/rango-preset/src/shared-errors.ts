import { WalletType } from '@rango-dev/wallets-shared';

export type ErrorDetail = {
  extraMessage: string;
  extraMessageDetail?: string | null | undefined;
  extraMessageErrorCode: string | null;
};

export enum APIErrorCode {
  TX_FAIL = 'TX_FAIL',
  FETCH_TX_FAILED = 'FETCH_TX_FAILED',
  USER_REJECT = 'USER_REJECT',
  CALL_WALLET_FAILED = 'CALL_WALLET_FAILED',
  SEND_TX_FAILED = 'SEND_TX_FAILED',
  CALL_OR_SEND_FAILED = 'CALL_OR_SEND_FAILED',
  USER_CANCEL = 'USER_CANCEL',
  CLIENT_UNEXPECTED_BEHAVIOUR = 'CLIENT_UNEXPECTED_BEHAVIOUR',
}

export enum ApiMethodName {
  RequestingSwapTransaction = 'Requesting Swap Transaction',
  CreatingSwap = 'Creating Swap',
  CheckingTransactionStatus = 'Checking transaction status',
  CreateTransaction = 'Create Transaction',
  CheckApproval = 'Check TX Approval',
  GettingSwapDetail = 'Getting Swap Detail',
  GettingUserLimits = 'Getting user limits',
}

export enum TransactionName {
  GenericTransaction = 'transaction',
  SendingOneInchTransaction = '1inch transaction',
  Approval = 'approve transaction',
}

export const ERROR_ASSERTION_FAILED = 'Assertion failed (Unexpected behaviour)';

export const ERROR_COMMUNICATING_WITH_API = (
  apiMethodName: ApiMethodName
): string => `Unexpected response from API (${apiMethodName})`;

export const ERROR_DESCRIPTION_UNSUPPORTED_TRANSACTION = (
  method: string,
  walletType: WalletType
): string => `method: ${method} call is unsupported for wallet ${walletType}`;

export const ERROR_SIGNING_TRANSACTION = (
  transactionName: TransactionName
): string => `Error sending ${transactionName}`;
export const ERROR_REJECTING_TRANSACTION = 'User rejected the message signing';

export const ERROR_CREATE_TRANSACTION =
  'Create transaction failed in Rango Server';
export const ERROR_INPUT_WALLET_NOT_FOUND = 'Input wallet not found';

export const DEFAULT_WALLET_INJECTION_ERROR =
  'Failed to connect to wallet, if you have turned injection off (disable default wallet for xDefi), turn it on and refresh the page';

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

  