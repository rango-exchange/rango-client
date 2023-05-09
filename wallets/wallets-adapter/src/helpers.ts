import { WalletInfo, WalletState, WalletType } from '@rango-dev/wallets-shared';
import { ModalState, State } from './types';
import {
  WalletInfo as ModalWalletInfo,
  WalletState as WalletStatus,
} from '@rango-dev/ui';

export const defaultState: ModalState = {
  open: false,
};
export function state_reducer(
  state: { open: boolean },
  action: { value: boolean }
) {
  return {
    ...state,
    open: action.value,
  };
}

export const getStateWallet = (state: State): WalletStatus => {
  switch (true) {
    case state.connected:
      return WalletStatus.CONNECTED;
    case state.connecting:
      return WalletStatus.CONNECTING;
    case !state.installed:
      return WalletStatus.NOT_INSTALLED;
    default:
      return WalletStatus.DISCONNECTED;
  }
};

export function getlistWallet(
  getState: (type: WalletType) => WalletState,
  getWalletInfo: (type: WalletType) => WalletInfo,
  list: WalletType[]
): ModalWalletInfo[] {
  const excludedWallets = [WalletType.UNKNOWN, WalletType.LEAP];

  return list
    .filter((wallet) => !excludedWallets.includes(wallet))
    .map((type) => {
      const {
        name,
        img: image,
        installLink,
        showOnMobile,
      } = getWalletInfo(type);
      const state = getStateWallet(getState(type));
      return {
        name,
        image,
        installLink,
        state,
        type,
        showOnMobile: showOnMobile || false,
      };
    });
}
