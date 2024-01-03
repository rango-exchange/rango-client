import type { ModalState, State } from './types';
import type { WalletInfo as ModalWalletInfo } from '@yeager-dev/ui';
import type {
  WalletInfo,
  WalletState,
  WalletType,
} from '@yeager-dev/wallets-shared';

import { WalletState as WalletStatus } from '@yeager-dev/ui';

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

export function mapWalletTypesToWalletInfo(
  getState: (type: WalletType) => WalletState,
  getWalletInfo: (type: WalletType) => WalletInfo,
  list: WalletType[]
): ModalWalletInfo[] {
  return list.map((type) => {
    const { name, img: image, installLink, showOnMobile } = getWalletInfo(type);
    const state = getStateWallet(getState(type));
    return {
      title: name,
      image,
      link: installLink,
      state,
      type,
      showOnMobile: showOnMobile || false,
    };
  });
}
