/**
 * The largest limit Stellar accepts for a trust line, and the least limit an
 * existing line needs for the prerequisite to be skipped.
 * https://stellar-sdk.readthedocs.io/en/stable/_modules/stellar_sdk/operation/change_trust.html
 */
export const STELLAR_TRUST_LINE_INFINITE_VALUE = '922337203685.4775807';

/** Fee of the Stellar ChangeTrust transaction, in stroops. */
export const STELLAR_TRUST_LINE_FEE = '100';

/** How long the Stellar ChangeTrust transaction stays valid, in seconds. */
export const STELLAR_TRUST_LINE_TIMEOUT = 30;
