import {
  WidgetTheme,
  WidgetConfig,
  WidgetColors,
  BlockchainAndTokenConfig,
} from './types';
import { WidgetProps, Widget } from './Widget';
import { WalletType } from '@rango-dev/wallets-shared';
import { WidgetWallets } from './Wallets';
import { useWallets } from '@rango-dev/wallets-core';
import {
  useEvents as useWidgetEvents,
  MainEvents,
} from '@rango-dev/queue-manager-rango-preset';
import {
  RouteEvent,
  StepEvent,
} from '@rango-dev/queue-manager-rango-preset/dist/types';

export type {
  WidgetConfig,
  WalletType,
  WidgetTheme,
  WidgetColors,
  BlockchainAndTokenConfig,
  WidgetProps,
  RouteEvent,
  StepEvent,
};
export { Widget, WidgetWallets };
export { useWallets, useWidgetEvents, MainEvents };
