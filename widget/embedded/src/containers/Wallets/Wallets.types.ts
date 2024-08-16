import type { WidgetConfig } from '../../types';
import type { LegacyEventHandler as EventHandler } from '@rango-dev/wallets-core/legacy';

export type OnWalletConnectionChange = (key: string) => void;
export interface WidgetContextInterface {
  /**
   * A wallet connection handler, utilized within the wallet provider,
   * is linked to the useBootstrap hook for synchronizing the state of the last connected wallet.
   * It's important not to override this handler in other locations.
   */
  onConnectWallet(handler: OnWalletConnectionChange): void;
  /**
   * A wallet disconnection handler, utilized within the wallet provider,
   * is linked to the useBootstrap hook for synchronizing the state of the last disconnected wallet.
   * It's important not to override this handler in other locations.
   */
  onDisconnectWallet(handler: OnWalletConnectionChange): void;
}

export interface PropTypes {
  onUpdateState?: EventHandler;
  config: WidgetConfig;
}
