/*
 * TODO: I couldn't found tron in caip
 * @see https://namespaces.chainagnostic.org/
 */

// if the value needs to be change make sure you will update mapCaipNamespaceToLegacyNetworkName as well
export const CAIP_NAMESPACE = 'tron';
export const CAIP_TRON_CHAIN_ID = 'tron';

/**
 * Default fee limit (in SUN) for a client-built TRC-20 approve transaction.
 * 250 TRX — matches the value the backend used for server-built approvals.
 */
export const DEFAULT_APPROVE_FEE_LIMIT = 250_000_000;

/** The TRC-20 call the approve prerequisite issues. */
export const APPROVE_FUNCTION_SELECTOR = 'approve(address,uint256)';

/**
 * Length in hex characters of the function selector that prefixes a call's
 * data: 4 bytes, two characters each.
 */
export const FUNCTION_SELECTOR_HEX_LENGTH = 8;
