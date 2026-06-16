export const CAIP_NAMESPACE = 'bip122';
export const CAIP_BITCOIN_CHAIN_ID = '000000000019d6689c085ae165831e93';
export const CAIP_ZCASH_CHAIN_ID = 'zcash';
export const CAIP_LITECOIN_CHAIN_ID = '12a765e31ffd4059bada1e25190f6e98';
export const CAIP_DOGECOIN_CHAIN_ID = '1a91e3dace36e2be3bf030a65679fe82';
/*
 * Bitcoin Cash shares Bitcoin's genesis block, so its CAIP-2 reference uses a
 * later block hash prefix (per the chainagnostic bip122 registry) to stay unique.
 */
export const CAIP_BITCOINCASH_CHAIN_ID = '000000000000000000651ef99cb9fcbe';
