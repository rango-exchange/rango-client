export const BALANCE_SEPARATOR = '~';

export const EXCLUDED_WALLETS: string[] = [];

// Plain strings, so the widget doesn't need provider packages for these ids.
export const WALLET_IDS = {
  DEFAULT: 'default',
  WALLET_CONNECT_2: 'wallet-connect-2',
  LEDGER: 'ledger',
  LEDGER_WALLET: 'ledger-wallet',
  TREZOR: 'trezor',
  TON_CONNECT: 'tonconnect',
  OKX: 'okx',
} as const;
