import type { ModalState, State } from './types';
import type { WalletInfo as ModalWalletInfo } from '@rango-dev/ui';
import type {
  WalletInfo,
  WalletState,
  WalletType,
} from '@rango-dev/wallets-shared';

import { WalletState as WalletStatus } from '@rango-dev/ui';

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
  return list.map((type) => {
    const { name, img: image, installLink, showOnMobile } = getWalletInfo(type);
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
