export const WC_PROJECT_ID = 'e24844c5deb5193c1c14840a7af6a40b';
export const TREZOR_MANIFEST = {
  appUrl: 'https://widget.rango.exchange/',
  email: 'hi+trezorwidget@rango.exchange',
};
export const TON_CONNECT_MANIFEST_URL =
  'https://raw.githubusercontent.com/rango-exchange/assets/refs/heads/main/manifests/tonconnect/manifest.json';

/**
 * RPC urls for wallets that can't read the chain through themselves, such as
 * Ledger and Trezor. Only Ethereum is configured here, on a public node.
 */
export const RPC_URLS = {
  evm: { 1: ['https://ethereum-rpc.publicnode.com'] },
};
