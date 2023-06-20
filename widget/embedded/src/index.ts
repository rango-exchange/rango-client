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
  RouteEvent,
  StepEvent,
  Route,
  Step,
} from '@rango-dev/queue-manager-rango-preset';

export type {
  WidgetConfig,
  WalletType,
  WidgetTheme,
  WidgetColors,
  BlockchainAndTokenConfig,
  WidgetProps,
  RouteEvent,
  StepEvent,
  Route,
  Step,
};
export { Widget, WidgetWallets };
export { useWallets, useWidgetEvents, MainEvents };
