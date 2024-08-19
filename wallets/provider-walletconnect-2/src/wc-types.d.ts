// see notes.md for more details.
import type {
  ConfigCtrlState,
  ThemeCtrlState,
} from '@walletconnect/modal-core';
/**
 * Types
 */
export type WalletConnectModalConfig = ConfigCtrlState & ThemeCtrlState;

/**
 * Client
 */
export declare class WalletConnectModal {
  openModal: (
    options?: // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    | import('@walletconnect/modal-core/dist/_types/src/controllers/ModalCtrl').OpenOptions
      | undefined
  ) => Promise<void>;
  closeModal: () => void;
  subscribeModal: (
    callback: (
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      newState: import('@walletconnect/modal-core/dist/_types/src/types/controllerTypes').ModalCtrlState
    ) => void
  ) => () => void;

  setTheme: (theme: ThemeCtrlState) => void;
  private initUi;
  constructor(config: WalletConnectModalConfig);
}
