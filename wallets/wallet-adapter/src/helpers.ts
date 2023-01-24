import {
  Network,
  WalletInfo,
  WalletState,
  WalletType,
} from '@rangodev/wallets-shared';
import { State as ModalState } from './types';
import {
  WalletInfo as ModalWalletInfo,
  WalletState as WalletStatus,
} from '@rangodev/ui';

export const defaultState: ModalState = {
  open: false,
};
export function state_reducer(state: { open: boolean }, action: any) {
  return {
    ...state,
    open: action.value,
  };
}

export interface State {
  connected: boolean;
  connecting: boolean;
  reachable: boolean;
  installed: boolean;
  accounts: string[] | null;
  network: Network | null;
}

export const getStateWallet = (state: State): WalletStatus => {
  if (state.connected) {
    return WalletStatus.CONNECTED;
  } else if (state.connecting) {
    return WalletStatus.CONNECTING;
  } else if (!state.installed) {
    return WalletStatus.NOT_INSTALLED;
  }
  return WalletStatus.DISCONNECTED;
};

export function getlistWallet(
  getState: (type: WalletType) => WalletState,
  getWalletInfo: (type: WalletType) => WalletInfo
): ModalWalletInfo[] {
  const excludedWallets = [
    WalletType.UNKNOWN,
    WalletType.TERRA_STATION,
    WalletType.LEAP,
  ];
  // @ts-ignore
  return Object.values(WalletType)
    .filter((wallet) => !excludedWallets.includes(wallet))
    .map((type) => {
      const { name, img: image, installLink } = getWalletInfo(type);
      const state = getStateWallet(getState(type));
      return {
        name,
        image,
        installLink,
        state,
        type,
      };
    });
}
