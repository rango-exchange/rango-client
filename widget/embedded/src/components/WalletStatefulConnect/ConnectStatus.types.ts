export interface ConnectStatusProps {
  /*
   * We can not use `WalletInfoWithExtra` because the inside state will be stale in some cases.
   * We should directly use `useWallets` to make sure we have a correct state.
   */
  wallet: {
    type: string;
    image: string;
  };
  error?: string;
}
