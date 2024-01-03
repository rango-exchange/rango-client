import type { WidgetConfig } from '../../types';
import type { EventHandler } from '@yeager-dev/wallets-react';

export type OnConnectHandler = (key: string) => void;
export interface WidgetContextInterface {
  onConnectWallet(handler: OnConnectHandler): void;
}

export interface PropTypes {
  onUpdateState?: EventHandler;
  config: WidgetConfig;
}
