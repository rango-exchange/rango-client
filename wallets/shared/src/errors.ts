import { WalletType } from './rango';

export enum WalletErrorCode {
  REJECTED_BY_USER = 'REJECTED_BY_USER',
  SIGN_TX_ERROR = 'SIGN_TX_ERROR',
  SEND_TX_ERROR = 'SEND_TX_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  OPERATION_UNSUPPORTED = 'OPERATION_UNSUPPORTED',
  UNEXPECTED_BEHAVIOUR = 'UNEXPECTED_BEHAVIOUR',
}

export function isWalletErrorCode(value: string): value is WalletErrorCode {
  return Object.keys(WalletErrorCode).includes(value);
}

export function getDefaultErrorMessage(code: WalletErrorCode): string {
  const errorMap: { [key in WalletErrorCode]: string } = {
    [WalletErrorCode.REJECTED_BY_USER]: 'User rejected the transaction',
    [WalletErrorCode.SIGN_TX_ERROR]: 'Error signing the transaction',
    [WalletErrorCode.SEND_TX_ERROR]: 'Error sending the transaction',
    [WalletErrorCode.NOT_IMPLEMENTED]: 'Operation not implemented',
    [WalletErrorCode.OPERATION_UNSUPPORTED]: 'Unsupported operation',
    [WalletErrorCode.UNEXPECTED_BEHAVIOUR]: 'Unexpected error',
  };
  return errorMap[code];
}

export type WalletOperationName =
  | 'executeEvmTransaction'
  | 'executeCosmosMessage'
  | 'executeSolanaTransaction'
  | 'executeTransfer'
  | 'signEvmMessage';

export class WalletError extends Error {
  public readonly code: WalletErrorCode;
  public readonly root?: any;

  constructor(code: WalletErrorCode, m?: string | undefined, root?: any) {
    super(m || getDefaultErrorMessage(code));
    Object.setPrototypeOf(this, WalletError.prototype);
    this.code = code;
    this.root = root;
    if (this.code === WalletErrorCode.REJECTED_BY_USER || WalletError.isRejectedError(root)) {
      this.code = WalletErrorCode.REJECTED_BY_USER;
      this.message = 'User rejected the transaction';
      this.root = undefined;
    }
  }

  static isRejectedError(error: any): boolean {
    const POSSIBLE_REJECTION_ERRORS = [
      'rejected by user',
      'rejected by the user',
      'user canceled',
      'user rejected',
      'user denied',
      'request rejected',
    ];
    if (!!error && typeof error === 'string') {
      for (const msg of POSSIBLE_REJECTION_ERRORS) {
        if (error.toLowerCase().includes(msg.toLowerCase())) return true;
      }
    } else if (!!error && typeof error === 'object') {
      if (error?.code === 4001) return true;
      for (const msg of POSSIBLE_REJECTION_ERRORS) {
        if (
          JSON.stringify(error).toLowerCase().includes(msg.toLowerCase()) ||
          (error?.message || '').toLowerCase().includes(msg.toLowerCase())
        )
          return true;
      }
    }
    return false;
  }

  static UnsupportedError(operation: WalletOperationName, walletType: WalletType): WalletError {
    return new WalletError(
      WalletErrorCode.OPERATION_UNSUPPORTED,
      `'${operation}' is not supported by the ${walletType}`,
    );
  }
  static UnimplementedError(operation: WalletOperationName, walletType: WalletType): WalletError {
    return new WalletError(
      WalletErrorCode.NOT_IMPLEMENTED,
      `'${operation}' is not implemented by the ${walletType}`,
    );
  }

  static AssertionFailed(m: string): WalletError {
    return new WalletError(WalletErrorCode.UNEXPECTED_BEHAVIOUR, 'Assertion failed: ' + m);
  }

  getErrorDetail(): { code: WalletErrorCode; message: string; detail?: string | undefined } {
    if (this.code === WalletErrorCode.REJECTED_BY_USER) {
      return {
        code: this.code,
        message: this.message,
        detail: this.root?.message || 'User rejected the transaction',
      };
    }

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
      code: this.code,
      message: this.message,
      detail: rootStr,
    };
  }
}
