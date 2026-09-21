import { ActionError } from '../../../errors';

/** EIP-712 typed data in the shape the EVM signer takes: one primary type, its domain, and the value. */
export type TypedData = {
  domain: unknown;
  types: Record<string, unknown>;
  value: Record<string, unknown>;
};

/** The recovery ids the exchange takes, EIP-155 style; wallets that return raw 0 and 1 are shifted up. */
const RECOVERY_ID_LOW = 27;
const RECOVERY_ID_HIGH = 28;

type RecoveryId = typeof RECOVERY_ID_LOW | typeof RECOVERY_ID_HIGH;

/** An ECDSA signature split the way the exchange API takes it. */
export type SplitSignature = {
  r: string;
  s: string;
  v: RecoveryId;
};

/** A 65-byte signature: `0x`, then r, s, and v as hex. */
const SIGNATURE_LENGTH = 132;
const R_END = 66;
const S_END = 130;
const HEX_RADIX = 16;

/**
 * The API hands over the message to sign as the full EIP-712 payload in
 * JSON. The signer wants only the primary type's definition, so the payload
 * is cut down to that.
 */
export function parseTypedData(message: string): TypedData {
  let payload: {
    domain?: unknown;
    primaryType?: string;
    types?: Record<string, unknown>;
    message?: Record<string, unknown>;
  };
  try {
    payload = JSON.parse(message);
  } catch (error) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      'The Hyperliquid message to sign is not valid JSON',
      error
    );
  }

  const { domain, primaryType, types, message: value } = payload;
  if (!domain || !primaryType || !types?.[primaryType] || !value) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      'The Hyperliquid message to sign is not EIP-712 typed data'
    );
  }

  return { domain, types: { [primaryType]: types[primaryType] }, value };
}

/** Splits a `0x`-prefixed 65-byte signature into r, s, and v, with v as 27 or 28. */
export function splitSignature(signature: string): SplitSignature {
  if (signature.length !== SIGNATURE_LENGTH) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `Expected a 65-byte signature, got ${signature.length} characters`
    );
  }

  return {
    r: `0x${signature.slice(2, R_END)}`,
    s: `0x${signature.slice(R_END, S_END)}`,
    v: toRecoveryId(parseInt(signature.slice(S_END), HEX_RADIX)),
  };
}

function toRecoveryId(raw: number): RecoveryId {
  const v = raw === 0 || raw === 1 ? raw + RECOVERY_ID_LOW : raw;
  if (v === RECOVERY_ID_LOW) {
    return RECOVERY_ID_LOW;
  }
  if (v === RECOVERY_ID_HIGH) {
    return RECOVERY_ID_HIGH;
  }
  throw new ActionError(
    'CLIENT_UNEXPECTED_BEHAVIOUR',
    `Invalid signature recovery value ${raw}, expected 27 or 28`
  );
}
