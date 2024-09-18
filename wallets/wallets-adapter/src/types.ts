import type { Providers } from '@rango-dev/wallets-react';
import type {
  Network,
  WalletInfo,
  WalletType,
} from '@rango-dev/wallets-shared';
import type { SignerFactory } from 'rango-types';

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
  getSigners(type: WalletType): Promise<SignerFactory>;
  getWalletInfo(type: WalletType): WalletInfo;
};

export interface ModalState {
  open: boolean;
}
