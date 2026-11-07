import type { WalletController } from '../types/walletController';

const NO_WALLETS_ERROR = 'No wallet controller has been passed to the widget.';

// For configs without wallets, e.g. `DEFAULT_CONFIG`.
export const EMPTY_WALLET_CONTROLLER: WalletController = {
  async connect() {
    throw new Error(NO_WALLETS_ERROR);
  },
  async disconnect() {
    return;
  },
  state() {
    return {
      connected: false,
      connecting: false,
      reachable: false,
      installed: false,
      accounts: null,
      network: null,
    };
  },
  canSwitchNetworkTo() {
    return false;
  },
  async getSigners() {
    throw new Error(NO_WALLETS_ERROR);
  },
  getWalletInfo() {
    throw new Error(NO_WALLETS_ERROR);
  },
  hubProvider() {
    throw new Error(NO_WALLETS_ERROR);
  },
  subscribe() {
    return () => {
      return;
    };
  },
};
