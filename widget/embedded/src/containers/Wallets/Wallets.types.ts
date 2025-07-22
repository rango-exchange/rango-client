import type { WidgetConfig } from '../../types';
import type { LastConnectedWallet } from '@arlert-dev/queue-manager-rango-preset';
import type {
  LegacyEventHandler as EventHandler,
  LegacyEvents,
} from '@arlert-dev/wallets-core/legacy';

export type OnWalletConnectHandler = (wallet: LastConnectedWallet) => void;
export type OnWalletDisconnectHandler = (walletType: string) => void;
export interface WidgetContextInterface {
  /**
   * A wallet connection handler, utilized within the wallet provider,
   * is linked to the useBootstrap hook for synchronizing the state of the last connected wallet.
   * It's important not to override this handler in other locations.
   */
  onConnectWallet(handler: OnWalletConnectHandler): void;
  /**
   * A wallet disconnection handler, utilized within the wallet provider,
   * is linked to the useBootstrap hook for synchronizing the state of the last disconnected wallet.
   * It's important not to override this handler in other locations.
   */
  onDisconnectWallet(handler: OnWalletDisconnectHandler): void;
}

type EventHandlerParams = Parameters<EventHandler>;
type EventParam = Exclude<LegacyEvents, LegacyEvents.PROVIDER_DISCONNECTED>;

export type OnUpdateState = (
  type: EventHandlerParams[0],
  event: EventParam,
  value: EventHandlerParams[2],
  coreState: EventHandlerParams[3],
  info: EventHandlerParams[4]
) => void;

export interface PropTypes {
  onUpdateState?: OnUpdateState;
  config: WidgetConfig;
}
