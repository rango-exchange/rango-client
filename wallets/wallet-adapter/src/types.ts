import { Providers, WalletSigners } from '@rango-dev/wallets-core';
import { Network, WalletType, WalletInfo } from '@rango-dev/wallets-shared';
export interface State {
  connected: boolean;
  connecting: boolean;
  reachable: boolean;
  installed: boolean;
  accounts: string[] | null;
  network: Network | null;
}

export type ProviderContext = {
  onOpenModal: () => void;
  onCloseModal: () => void;
  disconnectAll(): Promise<PromiseSettledResult<any>[]>;
  canSwitchNetworkTo(type: WalletType, network: Network): boolean;
  providers(): Providers;
  getSigners(type: WalletType): WalletSigners;
  getWalletInfo(type: WalletType): WalletInfo;
};

export interface ModalState {
  open: boolean;
}
