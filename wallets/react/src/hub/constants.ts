import { WalletTypes } from '@rango-dev/provider-all';

export const HUB_LAST_CONNECTED_WALLETS = 'hub-v1-last-connected-wallets';

// Wallets that always report themselves installed (hardware wallets and connection protocols).
export const WALLET_DETECTED_SKIPPED_IDS: string[] = [
  WalletTypes.LEDGER,
  WalletTypes.TREZOR,
  WalletTypes.LEDGER_WALLET,
  WalletTypes.WALLET_CONNECT_2,
  WalletTypes.TON_CONNECT,
  WalletTypes.DEFAULT,
];
