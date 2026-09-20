type TrezorFailurePayload = {
  error: string;
  code?: string;
};

/**
 * Creates the error a failed Trezor call throws while connecting. It keeps
 * Trezor's `code`, so `convertTrezorRejectionError` can recognise rejections.
 */
export function createTrezorConnectError(payload: TrezorFailurePayload): Error {
  const error = new Error(payload.error);
  if (payload.code) {
    return Object.assign(error, { code: payload.code });
  }
  return error;
}
