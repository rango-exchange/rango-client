import type { ConfigSlice } from './config';
import type { DataSlice } from './data';
import type { SettingsSlice } from './settings';
import type { WalletsSlice } from './wallets';

export type AppStoreState = DataSlice &
  ConfigSlice &
  SettingsSlice &
  WalletsSlice;
