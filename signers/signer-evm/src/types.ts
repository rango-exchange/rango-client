export const MetamaskErrorCodes = {
  rpc: {
    invalidInput: -32000,
    resourceNotFound: -32001,
    resourceUnavailable: -32002,
    transactionRejected: -32003,
    methodNotSupported: -32004,
    limitExceeded: -32005,
    parse: -32700,
    invalidRequest: -32600,
    methodNotFound: -32601,
    invalidParams: -32602,
    internal: -32603,
  },
  provider: {
    userRejectedRequest: 4001,
    unauthorized: 4100,
    unsupportedMethod: 4200,
    disconnected: 4900,
    chainDisconnected: 4901,
  },
};

export enum RPCErrorCode {
  ACTION_REJECTED = 'ACTION_REJECTED',
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  CALL_EXCEPTION = 'CALL_EXCEPTION',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  TRANSACTION_REPLACED = 'TRANSACTION_REPLACED',
}

export enum RPCErrorMessage {
  UNDER_PRICED = 'underpriced',
  REPLACEMENT_FEE_TOO_LOW = 'replacement fee too low',
  INTRINSIC_GAS_TOO_LOW = 'intrinsic gas too low',
  OUT_OF_GAS = 'out of gas',
  INTERNAL_ERROR = 'Internal JSON-RPC error',
}
