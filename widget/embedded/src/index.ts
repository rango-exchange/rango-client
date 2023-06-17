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

export type {
  WidgetConfig,
  WalletType,
  WidgetTheme,
  WidgetColors,
  BlockchainAndTokenConfig,
  WidgetProps,
};
export { Widget, WidgetWallets };
export { useWallets };
